import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const token = jwt.sign({ userId: id }, "thisismysecretkey", {
    expiresIn: "7 days",
  });
  return token;
};
export { generateToken as default };
