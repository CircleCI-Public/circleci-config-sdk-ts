// An example of a function that can be used at runtime to determine if a deployment should be enabled
function isDeployable() {
  const date = new Date();
  const day = date.getDay();
  switch (day) {
    case 0: // Sunday
    case 6: // Saturday
    case 5: // Friday
      return false;
    default:
      return true;
  }
}

export { isDeployable };