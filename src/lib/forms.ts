export type Inquiry = { name: string; email: string; message: string };
export function validateInquiry(input: Inquiry) {
  const errors: Partial<Record<keyof Inquiry, string>> = {};
  if (input.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email address.";
  if (input.message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}
