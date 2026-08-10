const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('app.use((err: any')) {
  const insertIndex = code.indexOf('app.listen(PORT');
  const errorHandler = `
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
  });

  `;
  code = code.slice(0, insertIndex) + errorHandler + code.slice(insertIndex);
  fs.writeFileSync('server.ts', code);
}
