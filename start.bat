@echo off
echo ====================================
echo AI社畜評論家 起動スクリプト
echo ====================================
echo.

REM Node.jsがインストールされているか確認
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo エラー: Node.jsがインストールされていません。
    echo Node.jsをインストールしてから再度実行してください。
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo Node.jsバージョン:
node --version
echo.

REM node_modulesが存在しない場合はインストール
if not exist "node_modules" (
    echo 依存パッケージをインストールしています...
    call npm install
    if %errorlevel% neq 0 (
        echo エラー: パッケージのインストールに失敗しました。
        pause
        exit /b 1
    )
    echo.
)

REM TypeScriptをコンパイル
echo TypeScriptをコンパイルしています...
call npm run build
if %errorlevel% neq 0 (
    echo エラー: TypeScriptのコンパイルに失敗しました。
    pause
    exit /b 1
)
echo.

REM サーバーを起動
echo サーバーを起動しています...
echo ブラウザで http://localhost:8091 を開いてください。
echo 終了するには Ctrl+C を押してください。
echo.
call npm start

pause

@REM Made with Bob
