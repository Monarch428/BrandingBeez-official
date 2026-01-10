import { useEffect } from "react";

export const scrollToCaseStudies = () => {
    if (typeof document === "undefined") return;

    const section = document.getElementById("case-studies");
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};


export default function CaseStudyScrollHandler() {
    useEffect(() => {
        // If URL already has #case-studies
        if (window.location.hash === "#case-studies") {
            // slight delay to ensure DOM is ready
            setTimeout(scrollToCaseStudies, 100);
        }
    }, []);

    return null;
}
