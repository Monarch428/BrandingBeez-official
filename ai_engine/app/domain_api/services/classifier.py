def classify(features: dict, category: str):
    try:
        meta = features.get("meta", {})
        scripts = features.get("scripts", [])
        cookies = features.get("cookies", [])
        headers = features.get("headers", [])
        server = features.get("server_header", "")

        if category == "CMS":
            generator = meta.get("generator")
            if isinstance(generator,str):
                return {"detected":[generator],"confidence":0.9,"reason":"Meta generator tag found"}
            elif any("wp-" in s for s in scripts if isinstance(s,str)):
                return {"detected":["WordPress"],"confidence":0.8,"reason":"WP scripts detected"}
            else:
                return {"detected":["Static / Headless CMS"],"confidence":0.6,"reason":"No CMS signals"}

        if category == "Frontend":
            script_str = " ".join([s for s in scripts if isinstance(s,str)])
            if "react" in script_str.lower() or "__reactroot" in script_str.lower():
                return {"detected":["React"],"confidence":0.85,"reason":"React detected via script"}
            elif "vue" in script_str.lower() or "__vue__" in script_str.lower():
                return {"detected":["Vue"],"confidence":0.85,"reason":"Vue detected via script"}
            elif "angular" in script_str.lower() or "ng-version" in script_str.lower():
                return {"detected":["Angular"],"confidence":0.85,"reason":"Angular detected via script"}
            elif len(scripts)>15:
                return {"detected":["JS-heavy Frontend"],"confidence":0.7,"reason":"Many scripts detected"}
            else:
                return {"detected":["Static / Vanilla JS"],"confidence":0.6,"reason":"Minimal JS detected"}

        if category == "Backend":
            powered = headers.get("x-powered-by") if isinstance(headers,dict) else None
            if isinstance(powered,str):
                return {"detected":[powered],"confidence":0.8,"reason":"x-powered-by header"}
            return {"detected":["Backend Hidden"],"confidence":0.5,"reason":"Backend info not exposed"}

        if category == "Server":
            if isinstance(server,str) and server:
                return {"detected":[server],"confidence":0.75,"reason":"Server header present"}
            return {"detected":["Server Hidden"],"confidence":0.5,"reason":"Server header not disclosed"}

        if category == "Database":
            script_str = " ".join([s for s in scripts if isinstance(s,str)])
            if "graphql" in script_str.lower():
                return {"detected":["GraphQL Database/API"],"confidence":0.7,"reason":"GraphQL API detected"}
            return {"detected":["Database Hidden"],"confidence":0.5,"reason":"No database signals"}

        if category == "CDN":
            domains = features.get("script_domains",[])
            if len(domains)>3:
                return {"detected":["CDN-backed assets"],"confidence":0.75,"reason":"Assets from multiple domains"}
            return {"detected":["No CDN detected"],"confidence":0.5,"reason":"Few script domains"}

        if category == "Security":
            security_headers = {"content-security-policy","strict-transport-security","x-frame-options"}
            count = len(set(headers).intersection(security_headers)) if isinstance(headers,list) else 0
            return {"detected":["Security Headers Configured"],"confidence":min(0.9,0.4+count*0.15),
                    "reason":f"{count} security headers detected"}

        if category in ["Analytics","Marketing","Ecommerce"]:
            script_str = " ".join([s for s in scripts if isinstance(s,str)])
            if category=="Analytics" and any(k in script_str.lower() for k in ["gtag","google-analytics","hotjar"]):
                return {"detected":["Analytics Tool Found"],"confidence":0.85,"reason":"Analytics script detected"}
            if category=="Marketing" and any(k in script_str.lower() for k in ["hubspot","mailchimp","klaviyo"]):
                return {"detected":["Marketing/CRM Tool Found"],"confidence":0.85,"reason":"Marketing script detected"}
            if category=="Ecommerce" and any(k in script_str.lower() for k in ["shopify","woocommerce","magento"]):
                return {"detected":["Ecommerce Platform Found"],"confidence":0.85,"reason":"Ecommerce script detected"}
            return {"detected":["Unknown"],"confidence":0.5,"reason":"No signals detected"}

        return {"detected":["Unknown"],"confidence":0.5,"reason":"No signals matched"}

    except Exception as e:
        return {"detected":["Error"],"confidence":0,"reason":f"Exception: {str(e)}"}
