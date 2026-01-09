import re
from collections import Counter, defaultdict
from typing import Dict, List, Any, Tuple


class ReviewAnalyzer:
    # Lexicons used for coarse sentiment scoring (kept)
    POSITIVE_WORDS = [
        "good", "great", "excellent", "supportive", "flexible",
        "responsive", "communication", "professional", "quality", "fast", "quick",
        "helpful", "friendly", "reliable", "recommend", "amazing", "awesome",
        "results", "strategy", "transparent", "creative", "knowledgeable"
    ]

    NEGATIVE_WORDS = [
        "stress", "pressure", "toxic", "workload", "long hours",
        "poor", "bad", "delay", "delayed", "slow", "late",
        "bugs", "issue", "issues", "expensive", "costly", "overpriced",
        "unresponsive", "rude", "disappoint", "misleading", "unclear"
    ]

    # Expanded stopwords (adds the filler words you are seeing like "really", "have")
    STOPWORDS = {
        "the", "and", "a", "an", "to", "of", "in", "for", "on", "with", "is", "are", "was", "were",
        "it", "this", "that", "they", "we", "you", "i", "my", "our", "their", "as", "at", "by",
        "from", "or", "but", "if", "so", "very", "too", "not", "no", "yes", "can", "could",
        "would", "should", "been", "be", "do", "does", "did", "will", "just",
        "really", "have", "had", "has", "having", "get", "got", "make", "made", "much",
        "also", "more", "most", "like", "well", "one", "two", "three", "time", "times",
        "team",  # we’ll add teamwork via curated theme labels instead
    }

    # Only allow single-word themes from this curated set (prevents names like "vignesh")
    ALLOWED_SINGLE_THEMES = {
        "communication": "Communication",
        "responsive": "Responsiveness",
        "responsiveness": "Responsiveness",
        "professional": "Professionalism",
        "professionalism": "Professionalism",
        "quality": "Quality",
        "results": "Results",
        "reliable": "Reliability",
        "reliability": "Reliability",
        "support": "Support",
        "helpful": "Support",
        "friendly": "Support",
        "creative": "Creativity",
        "strategy": "Strategy",
        "seo": "SEO Expertise",
        "design": "Design Quality",
        "pricing": "Pricing / Value",
        "value": "Pricing / Value",
        "transparent": "Transparency",
        "speed": "Speed / Turnaround",
        "turnaround": "Speed / Turnaround",
    }

    def extract_numeric_rating(self, rating: str) -> float:
        try:
            return float(re.findall(r"\d+\.?\d*", rating)[0])
        except Exception:
            return 0.0

    def sentiment_score(self, pros: str, cons: str) -> float:
        pros = (pros or "").lower()
        cons = (cons or "").lower()

        positive_count = sum(word in pros for word in self.POSITIVE_WORDS)
        negative_count = sum(word in cons for word in self.NEGATIVE_WORDS)

        if positive_count + negative_count == 0:
            return 3.0

        score = 3 + (positive_count - negative_count)
        return max(1.0, min(5.0, score))

    def _tokenize(self, text: str) -> List[str]:
        text = (text or "").lower()
        tokens = re.findall(r"[a-z0-9']+", text)
        tokens = [t for t in tokens if len(t) >= 3 and t not in self.STOPWORDS]
        return tokens

    # --- Theme extraction (RAKE-style phrases) ---
    def _candidate_phrases(self, text: str) -> List[List[str]]:
        """
        Split text into candidate keyword phrases by stopwords/punctuation.
        """
        text = (text or "").lower()
        # Replace punctuation with separators
        text = re.sub(r"[^a-z0-9'\s]+", " | ", text)

        parts = [p.strip() for p in text.split("|")]
        phrases: List[List[str]] = []

        for part in parts:
            if not part:
                continue
            words = re.findall(r"[a-z0-9']+", part)
            current: List[str] = []
            for w in words:
                if w in self.STOPWORDS or len(w) < 3:
                    if current:
                        phrases.append(current)
                        current = []
                else:
                    current.append(w)
            if current:
                phrases.append(current)

        # Filter tiny/garbage phrases
        cleaned = []
        for p in phrases:
            p = [w for w in p if w not in self.STOPWORDS and len(w) >= 3]
            if not p:
                continue
            cleaned.append(p)
        return cleaned

    def _score_phrases(self, phrases: List[List[str]]) -> List[Tuple[str, float]]:
        """
        RAKE scoring: score(word)=degree(word)/freq(word); score(phrase)=sum(score(word)).
        """
        freq = Counter()
        degree = Counter()

        for phrase in phrases:
            unique = [w for w in phrase if w]
            length = len(unique)
            for w in unique:
                freq[w] += 1
                degree[w] += (length - 1)

        word_score = {}
        for w in freq:
            word_score[w] = (degree[w] + freq[w]) / float(freq[w])  # +freq smooths

        phrase_scores = []
        for phrase in phrases:
            # Prefer multi-word phrases; single words only if curated
            if len(phrase) == 1 and phrase[0] not in self.ALLOWED_SINGLE_THEMES:
                continue

            s = sum(word_score.get(w, 0.0) for w in phrase)
            phrase_scores.append((" ".join(phrase), s))

        return phrase_scores

    def _themes_from_texts(self, pros_texts: List[str], cons_texts: List[str], top_k: int = 6) -> Dict[str, List[str]]:
        # Build phrases separately for pros/cons
        pros_phrases = []
        for t in pros_texts:
            pros_phrases.extend(self._candidate_phrases(t))
        cons_phrases = []
        for t in cons_texts:
            cons_phrases.extend(self._candidate_phrases(t))

        pros_scored = self._score_phrases(pros_phrases)
        cons_scored = self._score_phrases(cons_phrases)

        # Frequency filter: remove phrases that appear only once (unless curated)
        def filter_by_freq(scored: List[Tuple[str, float]], phrases: List[List[str]]) -> List[str]:
            phrase_freq = Counter([" ".join(p) for p in phrases])
            out = []
            for p, _ in sorted(scored, key=lambda x: x[1], reverse=True):
                if p in out:
                    continue
                if phrase_freq.get(p, 0) >= 2:
                    out.append(p)
                else:
                    # allow curated single-word themes even if once
                    if p in self.ALLOWED_SINGLE_THEMES:
                        out.append(p)
                if len(out) >= top_k:
                    break
            return out

        pos = filter_by_freq(pros_scored, pros_phrases)
        neg = filter_by_freq(cons_scored, cons_phrases)

        # Map curated single words to friendly labels; title-case phrases
        def pretty(p: str) -> str:
            if p in self.ALLOWED_SINGLE_THEMES:
                return self.ALLOWED_SINGLE_THEMES[p]
            return p.strip().title()

        positive = [pretty(p) for p in pos]
        negative = [pretty(p) for p in neg]

        return {"positive_themes": positive, "negative_themes": negative}

    def analyze(self, reviews: Dict[str, List[Dict]]) -> Dict:
        ratings = []
        sentiment_scores = []

        pros_texts: List[str] = []
        cons_texts: List[str] = []

        for source_reviews in (reviews or {}).values():
            for r in source_reviews or []:
                rating = self.extract_numeric_rating(str((r or {}).get("rating", "")))
                if rating > 0:
                    ratings.append(rating)

                pros = (r or {}).get("pros", "") or ""
                cons = (r or {}).get("cons", "") or ""

                if pros.strip():
                    pros_texts.append(pros)
                if cons.strip():
                    cons_texts.append(cons)

                sentiment_scores.append(self.sentiment_score(pros, cons))

        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0
        avg_sentiment = round(sum(sentiment_scores) / len(sentiment_scores), 2) if sentiment_scores else 3
        overall_score = round((0.7 * avg_rating) + (0.3 * avg_sentiment), 2)

        themes = self._themes_from_texts(pros_texts, cons_texts, top_k=6)

        return {
            "average_rating": avg_rating,
            "average_sentiment": avg_sentiment,
            "overall_score": overall_score,
            "rating_scale": "out of 5",
            "positive_themes": themes.get("positive_themes", []),
            "negative_themes": themes.get("negative_themes", []),
        }
