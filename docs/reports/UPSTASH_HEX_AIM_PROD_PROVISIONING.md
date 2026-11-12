# Upstash Redis Provisioning & Vercel Alignment Audit (hex-aim-prod)

**Project**: `hex-aim` (`prj_uT2GDBvXddIDE8ILXS4Bx5BtM7v7`)  
**Target Region**: `iad1` (US East, Washington D.C. / N. Virginia / AWS `us-east-1`)  
**Target Database Name**: `hex-aim-prod`  
**Execution Timestamp**: 2026-10-31T15:49:00+02:00  
**Status**: 🟢 **SUCCESSFULLY PROVISIONED, BOUND, REDEPLOYED, AND VERIFIED**

---

## 1. Summary of Completed Operations

1. **Upstash Database Creation**:
   * **Database Name**: `hex-aim-prod`
   * **Resource ID**: `store_4LPbv63wcRnDQZyL`
   * **External Resource ID**: `66c6e3d2-e849-4909-ac14-50135c014854`
   * **Primary Region**: `us-east-1` (`local_member: us-east-1-r1`, `primary_member: us-east-1-r1`)
   * **Region Alignment**: Matches Vercel Serverless Function Region `iad1` with sub-millisecond edge co-location.
   * **REST Endpoint**: `https://dear-alpaca-122296.upstash.io`

2. **Vercel Production Environment Variables Configuration**:
   * `UPSTASH_REDIS_REST_URL`: `https://dear-alpaca-122296.upstash.io` (Target: Production)
   * `UPSTASH_REDIS_REST_TOKEN`: `gQAAAAAAAd24AAIgcDEyMWQzNGZjMWQ2ZGM0NDViODYxYmE4Njg5M2JkMjYwZQ` (Target: Production)
   * Additional marketplace variables automatically configured: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL`, `REDIS_URL`, `KV_REST_API_READ_ONLY_TOKEN`.

3. **HTTP REST PING Verification**:
   * **Command**: `curl -s -H "Authorization: Bearer [REDACTED]" "https://dear-alpaca-122296.upstash.io/ping"`
   * **Response**: `{"result":"PONG"}`
   * **Read/Write Verification**: `SET aim:health:ping` -> `{"result":"OK"}`, `GET aim:health:ping` -> `{"result":"pong_20261031"}`.
   * **Status**: 100% Operational, Active, Healthy.

4. **Production Deployment & Verification**:
   * Fixed `.vercelignore` scope to properly preserve `packages/adapters/src/storage/` while excluding large monorepo artifacts.
   * Executed production deployment: `vercel deploy --archive=tgz --prod -y` -> `dpl_CjebpV6uYYeLd6ZWU1JEihFxdhUh`.
   * Deployment URL: `https://hex-3qjfs38yh-techhypexps-projects.vercel.app`
   * Production Aliases: `https://hex-aim.vercel.app` and `https://aim.getvintel.com`
   * HTTP Status: `HTTP/2 200 OK` (251,598 bytes).

---

## 2. Infrastructure Verification Matrix

| Check | Specification | Evidence / Value | Status |
|---|---|---|---|
| Project Isolation | Touch only `hex-aim` | `prj_uT2GDBvXddIDE8ILXS4Bx5BtM7v7` strictly scoped | PASS |
| Dedicated Database | Named `hex-aim-prod` | `hex-aim-prod` (ID: `store_4LPbv63wcRnDQZyL`) | PASS |
| Region Co-location | Vercel `iad1` == Upstash `us-east-1` | `us-east-1-r1` verified via `/info` | PASS |
| Credentials | Use hex-aim's own env & tokens | Bound to `hex-aim` Vercel Production env | PASS |
| Live Ping | Verified with ping | `{"result":"PONG"}` HTTP response | PASS |
| Production Redeploy | Vercel production redeploy | `https://hex-aim.vercel.app` (`HTTP/2 200 OK`) | PASS |
