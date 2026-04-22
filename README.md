# GitHub OIDC Token Demo

In Github Actions we can ask Github to sign token that is OIDC compliant and can be verified on our side

Which allows us to make secure calls from Github Actions to our services

This repo holds some notes and examples of how it looks like

(token.yml)[.github/workflows/token.yml] workflow whos how token can be acquired

Inside `ACTIONS_ID_TOKEN_REQUEST_URL` will be `https://run-actions-2-azure-eastus.actions.githubusercontent.com/178//idtoken/97bd745b-f533-4b46-9f61-6be5f4a9dd93/979ae77c-ce43-51d9-a61c-f188d659a6ac?api-version=2.0`

So technically, inside actions we are doing:

```bash
curl "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=demo" -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN"
```

Curl response will be simply: `{"value":"...signed_jwt_token"}`

Token has following claims:

```json
{
  "actor": "marchenko1985",
  "actor_id": "88868",
  "aud": "demo",
  "base_ref": "",
  "check_run_id": "72463523102",
  "event_name": "workflow_dispatch",
  "exp": 1776844793,
  "head_ref": "",
  "iat": 1776844493,
  "iss": "https://token.actions.githubusercontent.com",
  "job_workflow_ref": "marchenko1985/github_oidc_token_demo/.github/workflows/token.yml@refs/heads/main",
  "job_workflow_sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4",
  "jti": "316ef8dc-d439-4990-862e-ae5037fe29d0",
  "nbf": 1776844193,
  "ref": "refs/heads/main",
  "ref_protected": "false",
  "ref_type": "branch",
  "repository": "marchenko1985/github_oidc_token_demo",
  "repository_id": "1217768983",
  "repository_owner": "marchenko1985",
  "repository_owner_id": "88868",
  "repository_visibility": "public",
  "run_attempt": "1",
  "run_id": "24766983965",
  "run_number": "3",
  "runner_environment": "github-hosted",
  "sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4",
  "sub": "repo:marchenko1985/github_oidc_token_demo:ref:refs/heads/main",
  "workflow": "token",
  "workflow_ref": "marchenko1985/github_oidc_token_demo/.github/workflows/token.yml@refs/heads/main",
  "workflow_sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4"
}
```

You might find details [here](https://docs.github.com/en/actions/reference/security/oidc)

> Note: in github we are using `echo -n $OIDC_TOKEN | base64 | xxd -p` to bypass its attempts to hide it, locally, once token is available do `echo -n ...token | xxd -r -p | base64 -d` to decode it back

## Verifying

On our side, once we have the token to verify it we should be something similar to this one

```js
import { createPublicKey, createVerify } from "crypto";

const token = "...";
const [header, payload, signature] = token.split(".");

const { alg, kid } = JSON.parse(Buffer.from(header, "base64url").toString("utf-8"));

const { jwks_uri } = await fetch("https://token.actions.githubusercontent.com/.well-known/openid-configuration").then((r) => r.json());

const jwks = await fetch(jwks_uri).then((r) => r.json());

const jwk = jwks.keys.find((k) => k.kid === kid && k.alg === alg);

const verifier = createVerify("RSA-SHA256")
  .update(header + "." + payload)
  .end();

const valid = verifier.verify(createPublicKey({ key: jwk, format: "jwk" }), signature);
console.log(valid); // true
```

You might find more complete example in [verify.mjs](verify.mjs)

The rest is simple - check iss, sub, exp, repo and other claims and if everything fine you might be sure call is comming from github

The beauty here is that we do not need to have any shared secret, and as a result there is nothing to hide/rotate/revoke.
