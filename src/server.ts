import app, { port } from "./app.js";

app.listen(port, () => {
  console.log(`TaskFlow app is running on port ${port}: http://localhost:${port}`);
});
