// Vercel Serverless Function for Zoho OAuth Callback
// Deploy this to Vercel and use the URL as your redirect_uri

export default function handler(req, res) {
  // Extract authorization code from query parameters
  const { code, error, error_description } = req.query;

  // Handle errors
  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            background: #f8d7da;
            color: #721c24;
            padding: 30px;
            border-radius: 8px;
            border: 2px solid #f5c6cb;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Authorization Error</h1>
          <p><strong>${error}</strong></p>
          <p>${error_description || 'An error occurred during authorization'}</p>
        </div>
      </body>
      </html>
    `);
  }

  // Success - return the authorization code
  if (code) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Success</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            background: #d4edda;
            color: #155724;
            padding: 30px;
            border-radius: 8px;
            border: 2px solid #c3e6cb;
          }
          .code-box {
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border: 2px solid #dee2e6;
          }
          button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px;
          }
          button:hover {
            background: #45a049;
          }
          .instructions {
            background: #d1ecf1;
            color: #0c5460;
            padding: 20px;
            border-radius: 4px;
            margin-top: 20px;
            text-align: left;
          }
          .copied {
            display: none;
            color: #155724;
            font-weight: bold;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="success">
          <h1>✅ Authorization Successful!</h1>
          <p>Your authorization code has been generated.</p>

          <div class="code-box" id="authCode">${code}</div>

          <button onclick="copyCode()">📋 Copy Authorization Code</button>
          <div class="copied" id="copiedMsg">✅ Code copied to clipboard!</div>

          <div class="instructions">
            <h3>Next Steps:</h3>
            <ol style="text-align: left;">
              <li>The code has been copied to your clipboard</li>
              <li>Go back to the token generator page</li>
              <li>Paste the code in the "Authorization Code" field</li>
              <li>Click "Exchange Code for Token"</li>
            </ol>
          </div>
        </div>

        <script>
          // Auto-copy code to clipboard
          const code = document.getElementById('authCode').textContent;

          function copyCode() {
            navigator.clipboard.writeText(code).then(() => {
              document.getElementById('copiedMsg').style.display = 'block';
              setTimeout(() => {
                document.getElementById('copiedMsg').style.display = 'none';
              }, 3000);
            });
          }

          // Try auto-copy on load
          try {
            navigator.clipboard.writeText(code);
          } catch (e) {
            console.log('Auto-copy failed, use button');
          }
        </script>
      </body>
      </html>
    `);
  }

  // No code or error
  return res.status(400).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invalid Request</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>❌ Invalid Request</h1>
      <p>No authorization code found.</p>
    </body>
    </html>
  `);
}
