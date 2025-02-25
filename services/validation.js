export function validateForm(data) {
  const errors = [];

  if (!data.fname || data.fname.trim() === "") {
    errors.push("First Name Is Required");
  }
  if (!data.lname || data.lname.trim() === "") {
    errors.push("Last Name Is Required");
  }
  if (
    !data.email ||
    data.email.trim() === "" ||
    data.email.indexOf("@") === -1 ||
    data.email.indexOf(".") === -1
  ) {
    errors.push("Email Format Is Invalid");
  }
  if (!data.method || data.method.trim() === "") {
    errors.push("Delivery Method Is Required");
  } else {
    const validOptions = ["pickup", "delivery"];
    if (!validOptions.includes(data.method)) {
      errors.push("Delivery Method Is Not Valid");
    }
  }
  if (!data.toppings || data.toppings.trim() === "") {
    errors.push("A Topping Is Required");
  }
  if (!data.size || data.size.trim() === "none") {
    errors.push("Size Is Required");
  } else {
    const validOptions = ["small", "medium", "large"];
    if (!validOptions.includes(data.size)) {
      errors.push("Size Is Not Valid");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
