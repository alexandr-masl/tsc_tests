
------- TSC CONFIG EXAMPLE -------------


{
   "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "noImplicitAny": false,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "outDir": "./Build"
   },
   "include": [
      "/Users/green/code/tsc_tests/**/*.ts",
      // "/root/my_crypto_robot/**/*.ts",
      "@types/**/*.d.ts",
      "node_modules/axios",
      "node_modules/redux-thunk"
   ],
   "exclude": [
      "build",
      "scripts",
      "acceptance-tests",
      "webpack",
      "jest",
      "src/setupTests.ts",
      "node_modules",
      "obj",
      "**/*.spec.ts"
    ],
}
 --------------------