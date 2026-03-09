import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 컴포넌트 kebab-case 규칙은 파일 이름 규칙으로 대체 (eslint-plugin-check-file 등 필요 시 추가)
      // 여기서는 기본적인 TS/JS 명명 규칙만 추가
      "camelcase": ["error", { "properties": "always" }],
      "no-unused-vars": "warn",
      "prefer-const": "error",
    }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
