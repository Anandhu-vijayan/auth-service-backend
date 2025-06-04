export default function httpError(status, publicMessage, internalMessage) {
  const err = new Error(internalMessage || publicMessage);
  err.status = status;
  err.publicMessage = publicMessage;
  return err;
}