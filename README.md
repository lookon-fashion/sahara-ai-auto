# Sahara AI automation tool

<div align="center">
  <img src="image.png" alt="Sahara AI">  
</div>

<div align="center">
  <h2>⚠️ Join DegenCoding сommunity</h2>
  <img width="100" src="https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png&color=000000" alt="Telegram">
  <p>
    <a href="https://t.me/+MRQx4biy9z02YjNi" style="text-decoration: none; margin: 0 10px;">
      <strong>Channel</strong>
    </a>
    |
    <a href="https://t.me/+mYi2OvPW8I01Y2Yy" style="text-decoration: none; margin: 0 10px;">
      <strong>Chat</strong>
    </a>
  </p>
</div>


## 📝 Description
Automation tool for Sahara Labs and Galxe daily tasks, including on-chain activities.

## ✨ Features

- Automated daily tasks completion on Sahara Labs
- Automated Galxe quests completion
- Automated on-chain activity (self-token transfers)
- Support for multiple accounts
- Proxy support for enhanced security
- Captcha solving integration

## 🔧 Requirements

- Node.js v20.17.0 or higher
- API keys from captcha solving services:
  - [2captcha.com](https://2captcha.com/)
  - [bestcaptchasolver.com](https://bestcaptchasolver.com/)
- Proxies (required)

## 🚀 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## 🔰 First-Time Setup

1. Run the script for the first time:
```bash
npm start
```

2. This will create template files in the `files` directory:
   - CSV template for accounts data
   - `config.yaml` for configuration settings

3. Fill in the required files:
   - Complete the CSV template with your account data
     - **IMPORTANT**: Do not delete the first row (header) in the CSV file - it is required!
     - **IMPORTANT**: This script is only supports http proxies! DO NOT USE ANY OTHER TYPE OF PROXY!
   - Configure `config.yaml` with your settings:
     - API keys for captcha services
     - Ref codes

4. Run the script again:
```bash
npm start
```

5. Select "Import data from CSV" option to import your account data

## 💫 Regular Usage

1. Run the script:
```bash
npm start
```

2. Select any needed option to start

## 🔒 Security
- Use reliable proxies to prevent IP bans

## 📌 Notes

- With 30% chance script will use dev's ref code!
- The script creates logs in the `logs` directory

## ⚖️ Disclaimer

This tool is for educational purposes only. Use at your own risk and make sure to comply with the terms of service of all platforms.

