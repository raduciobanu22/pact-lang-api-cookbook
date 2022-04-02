# Pact-Lang-API Cookbook

> Common use cases for `pact-lang-api`

---

## Overview

| Name | Description |
| ----------- | ----------- |
| **ACCOUNTS**  | |
| [Create Account](./accounts/create-account.js) | Create a KDA account. |
| [Create And Fund Account](./accounts/transfer-create.js) | Create and fund a KDA account.|

## Setup
1. Install dependencies

```bash
npm install
```

2. Set key pair

Each script requires a key pair that controls a KDA account used to pay for gas fees. Make sure you set the `KEY_PAIR` const.

3. Run commands

Example:

```bash
node accounts/create-account account-name

```

