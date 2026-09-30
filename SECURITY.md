# Security Policy

## 1. Supported Versions
As a general rule, only the **latest released version** of Accessibility Visualizer receives security fixes.  
If you are using an older version, please update to the latest version before reporting an issue.

| Version        | Supported |
| -------------- | --------- |
| Latest release | ✅        |
| Older releases | ❌        |


## 2. Reporting a Vulnerability
Please report security vulnerabilities **privately** through **GitHub Security Advisories**:

- https://github.com/ymrl/a11y-visualizer/security/advisories/new

You can also open the form from the repository's **Security** tab by selecting **"Report a vulnerability"**.

**Do not disclose vulnerabilities publicly** through Issues, Pull Requests, Discussions, or any other public channel before a fix has been released.  
Publicly disclosing a vulnerability before it is fixed may put users at risk.


## 3. What to Include in a Report
To help us understand and resolve the issue quickly, please include as much of the following as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce (a minimal test page or proof of concept is very helpful)
- Affected version(s) of the Extension
- Browser name and version (e.g. Chrome, Firefox, Edge)
- Any suggested fix or mitigation, if available


## 4. Response Process
This project is maintained by volunteers, so response times may vary.  
We will make a best effort to:

1. Acknowledge your report
2. Investigate and confirm the vulnerability
3. Develop and release a fix
4. Publish a security advisory after the fix has been released

Reporters will be credited in the advisory unless they prefer to remain anonymous.


## 5. Scope
This policy covers the source code in this repository, including the browser extension and the website.  
Vulnerabilities in third-party dependencies should be reported to their respective maintainers. If such a vulnerability affects this project, please let us know through the process above.

For the browser extension, we only handle issues that occur when it is used with one of the following browsers:

- The latest version of Google Chrome
- The latest version of Mozilla Firefox
- A version of Firefox ESR (Extended Support Release) that is still within its support period


## 6. Safe Harbor
We will not pursue legal action against anyone who researches and reports vulnerabilities in good faith and in accordance with this policy.  
When conducting security research, please:

- Avoid privacy violations, destruction of data, and disruption of services
- Only test against your own environments and data, and do not access or modify other people's data
- Give us reasonable time to fix the issue before any public disclosure


# セキュリティポリシー

## 1. サポート対象バージョン
原則として、Accessibility Visualizer の**最新リリースバージョンのみ**をセキュリティ修正の対象とします。  
古いバージョンをご利用の場合は、報告の前に最新バージョンへ更新してください。

| バージョン         | サポート |
| ------------------ | -------- |
| 最新リリース       | ✅       |
| それ以前のリリース | ❌       |


## 2. 脆弱性の報告
脆弱性は **GitHub Security Advisory** を通じて**非公開で**報告してください。

- https://github.com/ymrl/a11y-visualizer/security/advisories/new

リポジトリの **Security** タブから **「Report a vulnerability」** を選択して報告することもできます。

修正がリリースされる前に、Issue、Pull Request、Discussions、その他の公開の場で**脆弱性を公開しないでください**。  
修正前に脆弱性が公開されると、利用者が危険にさらされるおそれがあります。


## 3. 報告に含めていただきたい情報
迅速な調査と対応のため、可能な範囲で以下の情報を含めてください。

- 脆弱性の内容と想定される影響
- 再現手順（最小限のテストページや概念実証コードがあると助かります）
- 影響を受ける本拡張機能のバージョン
- ブラウザの名称とバージョン（例：Chrome、Firefox、Edge）
- 修正案や回避策（あれば）


## 4. 対応の流れ
本プロジェクトは有志によって運営されているため、対応に時間がかかる場合があります。  
以下の流れで、可能な限り対応します。

1. 報告の受領を連絡
2. 脆弱性の調査・確認
3. 修正の開発とリリース
4. 修正リリース後にセキュリティアドバイザリを公開

報告者の方は、匿名を希望されない限りアドバイザリにクレジットとして記載します。


## 5. 対象範囲
本ポリシーは、ブラウザ拡張機能およびWebサイトを含む、本リポジトリ内のソースコードを対象とします。  
依存しているサードパーティ製ライブラリの脆弱性は、それぞれのメンテナーへ報告してください。その脆弱性が本プロジェクトに影響する場合は、上記の方法でお知らせください。

ブラウザ拡張機能については、以下のいずれかのブラウザで使用した場合に発生する問題のみを取り扱います。

- 最新版の Google Chrome
- 最新版の Mozilla Firefox
- サポート期間内の Firefox ESR（Extended Support Release）


## 6. セーフハーバー
本ポリシーに従い、善意で脆弱性の調査・報告を行った方に対して、法的措置を取ることはありません。  
調査にあたっては、以下を守ってください。

- プライバシーの侵害、データの破壊、サービスの妨害を避けること
- 自身の環境とデータのみを用いて検証し、他者のデータにアクセスしたり改変したりしないこと
- 公開する前に、修正のための合理的な期間を設けること
