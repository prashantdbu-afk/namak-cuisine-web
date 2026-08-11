const mode = process.env.OPENAI_IMAGE_EDIT_MODE ?? "disabled";
if (mode === "disabled") {
  console.log(
    "Bar-shelf image editing is disabled. Natural photography remains in use.",
  );
  process.exit(0);
}
throw new Error(
  "No bar-shelf edit is owner-approved. Record a candidate, mask, natural-source reference, prompt, model, and approval before enabling an image-edit request.",
);
