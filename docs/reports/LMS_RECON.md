# LMS, SIMS and astencollege.com recon (unauthenticated)

Run: 2026-11-11 to 2026-11-12 (UTC). Method: GET requests only, no login, no credentials, no form submits. Polite 1 s delay between requests. Only the school hosts and public DNS and CT services were contacted.

## Summary

- LMS (lms.astencollege.com) and SIMS (sims.astencollege.com) share one Azure IP (52.168.161.61) on IIS 10 with ASP.NET. LMS is ASP.NET MVC 5.2. SIMS is classic WebForms with ViewState and no antiforgery token. The apex astencollege.com 301s to astencollege.edu.eg, and www serves an nginx "Server Test Page" under a *.name.tools certificate, so the WordPress site and casino text could not be verified.
- Unauthenticated surface is thin. LMS has 11 app routes (7 live or auth-gated, 4 not found). Zero grade or result routes were found. All 13 guessed grade or result paths returned 302 to the 404 handler, not to Login, so no result page is reachable before login. No HSTS, CSP or nosniff on either host, and LMS cookies lack the Secure flag.
- Two items need your input: the reported SQL error leak could not be reproduced or found in the repo (reproducing it needs a login submit, which was out of scope), and the cPanel, webmail and mail hostnames are publicly listed on the same IP as www.

## DNS

| Name | Record | Value | Notes |
|---|---|---|---|
| lms.astencollege.com | A | 52.168.161.61 | No CNAME. No PTR. 52.168.0.0/16 is a Microsoft Azure range (inferred, whois not installed). |
| sims.astencollege.com | A | 52.168.161.61 | Same IP as LMS. |
| www.astencollege.com | A | 169.62.4.20 | No CNAME. PTR hs8.name.tools. Certificate is *.name.tools. |
| astencollege.com (apex) | A | 15.197.225.128, 3.33.251.168 | No CNAME, no AAAA. PTR is awsglobalaccelerator.com (AWS Global Accelerator). |
| astencollege.com | MX | 0 astencollege-com.mail.protection.outlook.com | Microsoft 365 (Exchange Online). |
| astencollege.com | TXT | v=spf1 include:secureserver.net -all | GoDaddy SPF only. No Microsoft include, see findings. |
| astencollege.com | TXT | NETORGFT11786570.onmicrosoft.com | Microsoft 365 tenant verification record. |

Hosting hint: whois is not installed, so no registry lookup was done. The owner of the IPs is inferred from PTR records and the published ranges only.

## Subdomains

crt.sh returned 723 rows and 12 unique names. The first attempt returned 502 and the second returned 200.

| Name | Likely role | Resolves to | Notes |
|---|---|---|---|
| lms | LMS | 52.168.161.61 | Live. IIS 10, ASP.NET MVC 5.2. |
| sims | SIMS | 52.168.161.61 | Live. IIS 10, ASP.NET WebForms. |
| api | API | 52.168.161.61 | Root returns IIS 404. ASP.NET 4.0.30319. |
| www | Public site | 169.62.4.20 | nginx "Server Test Page". Certificate mismatch. |
| apex | Public site | 15.197.225.128, 3.33.251.168 | 301 to astencollege.edu.eg. |
| cpanel | Admin (cPanel) | 169.62.4.20 | Publicly listed admin name. Not probed. |
| webmail | Mail admin | 169.62.4.20 | Not probed. |
| webdisk | File admin (cPanel) | 169.62.4.20 | Not probed. |
| cpcalendars | cPanel calendars | 169.62.4.20 | Not probed. |
| cpcontacts | cPanel contacts | 169.62.4.20 | Not probed. |
| mail | Mail | 169.62.4.20 | Not probed. |
| *.astencollege.com | Wildcard certificate | n/a | A wildcard cert was issued. |

Not present in CT: portal, parent, staging, dev. The cPanel-style names share one IP with www, which suggests a shared hosting box.

## Public files

| Path | LMS | SIMS |
|---|---|---|
| /robots.txt | 404 text/html | 404 text/html |
| /sitemap.xml | 404 text/html | 404 text/html |
| /.well-known/security.txt | 404 text/html | 404 text/html |
| /favicon.ico | 200 image/x-icon, 32038 B | 200 image/x-icon, 4286 B |
| /swagger/v1/swagger.json | 404 text/html | 404 text/html |
| /swagger | 404 text/html | 404 text/html |
| /api/swagger | 404 text/html | 404 text/html |
| /openapi.json | 404 text/html | 404 text/html |

No robots.txt means no Disallow list and no sitemap URLs. No security.txt means no published disclosure contact. No API docs are public.

## Route map

The walk covered 23 same-origin URLs at depth 2, starting from the login page and the root. Culture variants of the same route are counted once.

| Route | Source | Unauth status | Meaning |
|---|---|---|---|
| /en/Home/Login | Seed, and form action="Login" on the login page | 200 | Login page. Fields: Email, LoginName, Mobile, Password, RememberMe, __RequestVerificationToken. |
| /ar/Home/Login | Language link on login page | 200 | Arabic login. |
| /fr/Home/Login | Language link on login page | 200 | French login. |
| /en/Home/ChangeLoginCulture?returnUrl=... | Language links, 9 returnUrl variants | 200 | Culture switch over GET. returnUrl not tested for open redirect. |
| /ar/Home/ChangeLoginCulture | Language links | 200 | Culture switch. |
| /fr/Home/ChangeLoginCulture | Language links | 200 | Culture switch. |
| /en/Home/Index | Probe (controller existence check) | 302 to /en/Home/Login | Exists and is auth-gated. |
| Reset-with-email and reset-with-login-name forms | Login page HTML, action="" | Not probed (forms) | Password reset by email or mobile code exists. Not submitted. |
| /Login | Form action resolution from root | 404 | Not a route. |
| /api/quick_search.php | String in Scripts/Themes/scripts.bundle.js and vendors.bundle.js | 404 | Dead string in bundle. |
| /api/videos/ | String in vendors.bundle.js | 404 | Dead string in bundle. |
| /api/v2/video/ | String in vendors.bundle.js | 404 | Dead string in bundle. |
| Static assets (9 files: bundles, jQuery, CSS, favicon) | Login page | 200 | Static. |
| Grade or result guesses (13): /en/Student/Grades, /en/Grade/Index, /en/Grades/Index, /en/Report/Index, /en/Reports/Index, /en/Progress/Index, /en/Quiz/Index, /en/Exam/Index, /en/Result/Index, /en/Results/Index, /en/Assessment/Index, /en/Student/Index, /en/Dashboard/Index | Guessed names | 302 to /Error?aspxerrorpath=... | Not found. Same response as a nonexistent control path. Not a login redirect. |
| SIMS / | Root | 200 | SIMS login. WebForms with __VIEWSTATE and __EVENTVALIDATION. Form action "./". |
| SIMS /Default.aspx | Guess | 200 | Same SIMS login page. |
| SIMS /Login.aspx | Guess | 302 to /Error.html?aspxerrorpath=... | Not found. |
| SIMS /Error.aspx | Guess | 302 to /Error.html?aspxerrorpath=... | Not found. |
| api / | Root | 404 (IIS) | Not found at root. Other paths not probed. |

Totals: LMS app routes 11 (7 live or auth-gated, 4 not found). Grade or result routes found: 0. SIMS live pages: 2.

Control: /en/zzqxnonexistent/Index returned 302 to /Error?aspxerrorpath=..., and /en/Home/Index returned 302 to Login. So the grade and result 302s are a not-found signal, not an auth signal.

## Security findings

Ranked by impact. Each is one line.

1. **High if confirmed, unverified:** A reported SQL error ("Column 'SchoolDefaultEducationSystem' does not belong to table") was pasted from the SIMS login. It was not reproduced, because reproducing it needs a login submit. It is not in the crawled pages or in the repo under the projects directory. Get the URL and time from the person who saw it. If it is real, SQL errors are reaching users and custom error handling is off.
2. **Medium:** LMS and SIMS send no Strict-Transport-Security header, so the first request can still be downgraded.
3. **Medium:** LMS and SIMS send no Content-Security-Policy, X-Content-Type-Options, Referrer-Policy or Permissions-Policy header.
4. **Medium:** SIMS sends no X-Frame-Options header, so the login page can be framed (clickjacking). LMS sends SAMEORIGIN.
5. **Medium:** The LMS cookies ASP.NET_SessionId and __RequestVerificationToken have no Secure flag. HttpOnly is set.
6. **Medium:** cPanel-style hostnames (cpanel, webmail, webdisk, cpcalendars, cpcontacts, mail) resolve to the shared IP 169.62.4.20 and are listed in public CT logs. Admin surfaces are advertised. They were not probed.
7. **Medium:** www.astencollege.com presents a *.name.tools certificate, so hostname verification fails in browsers. The IP serves an nginx default page, so the school's public site is not live there.
8. **Low:** Stack disclosure on both hosts: Server Microsoft-IIS/10.0, X-AspNet-Version 4.0.30319, X-Powered-By ASP.NET. LMS also sends X-AspNetMvc-Version 5.2.
9. **Low:** The apex 301 response's Server header exposes an internal AWS hostname and region (ip-100-74-4-107.eu-west-2.compute.internal).
10. **Low:** Unknown LMS paths 302 to /Error?aspxerrorpath=<request path>, which echoes the request path into the Location header.
11. **Low:** SIMS loads jQuery and webfont from the Google CDN with no Subresource Integrity attribute.
12. **Low, verify:** SPF is `include:secureserver.net -all`, but the MX is Microsoft 365 and SPF has no Microsoft include. Mail sent from Microsoft 365 would fail SPF. Confirm with the mail admin.
13. **Info:** No robots.txt, sitemap.xml or security.txt on any host. No published disclosure contact.
14. **Info:** Secret scan of the crawled LMS HTML and JS found no key or token literals (pattern scan, values not printed). Session cookie values and the login-page __RequestVerificationToken value are present in responses and were not copied.

## WordPress check (astencollege.com)

- The WordPress version could not be determined. The apex 301s to astencollege.edu.eg, which was not followed because it is outside the three hosts in scope. /readme.html, /wp-json/, /about-us/ and /about/ on the apex returned 404 with empty bodies.
- www (reached by IP 169.62.4.20 with a Host header, since the certificate does not match) returned the nginx "Server Test Page" (2592 bytes) with no WordPress markers (no wp-content, wp-json or generator meta).
- Casino or cashback text: 0 matches on www. It cannot be checked on the apex or edu.eg targets without going outside scope.
- The "critical error" on About Us was not reproduced: no About page is reachable on any host checked.
- The premise that astencollege.com is a WordPress site is not supported by the hosts checked. The WordPress site is probably at astencollege.edu.eg, which needs your confirmation before it is fetched.

## How to work with it (next step without a password)

1. Ask school IT for a sanctioned read-only path: a test or parent account from the LMS vendor, or a CSV or SFTP export of grades and progress. No grade data is reachable before login, so nothing else on the public surface gets you there.
2. Identify the LMS and SIMS vendor from the footer or branding after login, then request its API documentation. The public surface has no Swagger or OpenAPI.
3. Confirm with the school: the URL and time of the SQL error, which host is the WordPress site (astencollege.edu.eg?), and whether the cPanel hostnames are meant to be public.
4. Send findings 2 to 7 to school IT as a disclosure list. These are configuration fixes, not code changes in this repo.

## Limits

- whois is not installed. Owner hints come from PTR records and published ranges only.
- crt.sh returned 502 on the first try and 200 on the second.
- The crawl is login-page-only, with no session. Post-login routes are invisible, so "0 grade routes" means 0 found by guessed names, not 0 exist.
- Grade and result routes were guessed. The 13 names are not an exhaustive list.
- The vendors bundle was cut at the 3 MB read cap, so its route strings may be incomplete.
- GET only. No POSTs, no form submits, no login, no credentials. The culture-switch endpoints were requested with GET and no cookies were kept.
- Not done: following astencollege.edu.eg, probing the cPanel or webmail hosts, port scanning, fuzzing, and reproducing the SQL error.
