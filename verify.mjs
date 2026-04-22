import assert from "assert";
import { createPublicKey, createVerify } from "crypto";

const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4ODI2YjE3LTZhMzAtNWY5Yi1iMTY5LThiZWI4MjAyZjcyMyIsInR5cCI6IkpXVCIsIng1dCI6InlrTmFZNHFNX3RhNGsyVGdaT0NFWUxrY1lsQSJ9.eyJhY3RvciI6Im1hcmNoZW5rbzE5ODUiLCJhY3Rvcl9pZCI6Ijg4ODY4IiwiYXVkIjoiZGVtbyIsImJhc2VfcmVmIjoiIiwiY2hlY2tfcnVuX2lkIjoiNzI0NjM1MjMxMDIiLCJldmVudF9uYW1lIjoid29ya2Zsb3dfZGlzcGF0Y2giLCJleHAiOjE3NzY4NDQ3OTMsImhlYWRfcmVmIjoiIiwiaWF0IjoxNzc2ODQ0NDkzLCJpc3MiOiJodHRwczovL3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwiam9iX3dvcmtmbG93X3JlZiI6Im1hcmNoZW5rbzE5ODUvZ2l0aHViX29pZGNfdG9rZW5fZGVtby8uZ2l0aHViL3dvcmtmbG93cy90b2tlbi55bWxAcmVmcy9oZWFkcy9tYWluIiwiam9iX3dvcmtmbG93X3NoYSI6ImE2YzVmY2U5NzdkZGEyYzdkNTNhMjljMWVmMTc0NGMzMWJmNmQxYjQiLCJqdGkiOiIzMTZlZjhkYy1kNDM5LTQ5OTAtODYyZS1hZTUwMzdmZTI5ZDAiLCJuYmYiOjE3NzY4NDQxOTMsInJlZiI6InJlZnMvaGVhZHMvbWFpbiIsInJlZl9wcm90ZWN0ZWQiOiJmYWxzZSIsInJlZl90eXBlIjoiYnJhbmNoIiwicmVwb3NpdG9yeSI6Im1hcmNoZW5rbzE5ODUvZ2l0aHViX29pZGNfdG9rZW5fZGVtbyIsInJlcG9zaXRvcnlfaWQiOiIxMjE3NzY4OTgzIiwicmVwb3NpdG9yeV9vd25lciI6Im1hcmNoZW5rbzE5ODUiLCJyZXBvc2l0b3J5X293bmVyX2lkIjoiODg4NjgiLCJyZXBvc2l0b3J5X3Zpc2liaWxpdHkiOiJwdWJsaWMiLCJydW5fYXR0ZW1wdCI6IjEiLCJydW5faWQiOiIyNDc2Njk4Mzk2NSIsInJ1bl9udW1iZXIiOiIzIiwicnVubmVyX2Vudmlyb25tZW50IjoiZ2l0aHViLWhvc3RlZCIsInNoYSI6ImE2YzVmY2U5NzdkZGEyYzdkNTNhMjljMWVmMTc0NGMzMWJmNmQxYjQiLCJzdWIiOiJyZXBvOm1hcmNoZW5rbzE5ODUvZ2l0aHViX29pZGNfdG9rZW5fZGVtbzpyZWY6cmVmcy9oZWFkcy9tYWluIiwid29ya2Zsb3ciOiJ0b2tlbiIsIndvcmtmbG93X3JlZiI6Im1hcmNoZW5rbzE5ODUvZ2l0aHViX29pZGNfdG9rZW5fZGVtby8uZ2l0aHViL3dvcmtmbG93cy90b2tlbi55bWxAcmVmcy9oZWFkcy9tYWluIiwid29ya2Zsb3dfc2hhIjoiYTZjNWZjZTk3N2RkYTJjN2Q1M2EyOWMxZWYxNzQ0YzMxYmY2ZDFiNCJ9.qqkZFk5HgmIO-h2PmUTwqsmV7PzxeRSgj_VJ-VQwRdnM_O8lgYe1FFthpZuNIqh9jjbg7vlomOmVniz_7SBbej498AC6WjQEPlAI6kK_2tdGIaTD9gx-Vvlf0U7X42Nw2j8vm1-ERg-FKdrJKyJe99sNAlw5UR6IlN-TPN0DXG21LXz4ibz6CpofiUz4CoHZlNtP9EIKhr5xS0c69f_kVmNRszuPKRwp5gzvce279UOf1WXAZAuaBphxqfsRs_HMnEkgmhbS8lcDDHOh3xE5uuZILTtRG-n97NiqCzv2PotTyouh9wmIIxbGG9SVoUpNXpMLbe7Cm2DrH3m2JNx2FA";

const [header, payload, signature] = token.split(".");

const { alg, kid, typ } = JSON.parse(Buffer.from(header, "base64url").toString("utf-8"));
// console.log(alg); // RS256
// console.log(kid); // 38826b17-6a30-5f9b-b169-8beb8202f723
// console.log(typ); // JWT

const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
// console.log(claims); // {aud, sub, iss, iat, exp, ...}

const { jwks_uri } = await fetch("https://token.actions.githubusercontent.com/.well-known/openid-configuration").then((r) => r.json());
// console.log(jwks_uri); // https://token.actions.githubusercontent.com/.well-known/jwks

const jwks = await fetch(jwks_uri).then((r) => r.json());
// console.log(jwks); // {keys: [{kid, alg, kty, use, n, e}]}

const jwk = jwks.keys.find((k) => k.kid === kid && k.alg === alg);
assert(jwk, "Public key not found in JWKS");

const verifier = createVerify("RSA-SHA256")
  .update(header + "." + payload)
  .end();

const valid = verifier.verify(createPublicKey({ key: jwk, format: "jwk" }), signature);
console.log({ valid }); // { valid: true }
