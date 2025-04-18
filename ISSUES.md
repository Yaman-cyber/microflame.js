# Issues

If you encounter any issues or bugs with MicroFlame, please follow the steps below to report the issue.

## How to Report an Issue

Please provide as much detail as possible when opening an issue. Your report should include the following:

### 1. **Title**

Provide a clear and concise title that summarizes the issue you're facing. This helps in quickly identifying the problem.

Example:

- `Controller generation command fails`
- `Model not created properly in the 'generate model' command`

### 2. **Description**

Provide a detailed description of the issue. Include the following:

- **Steps to reproduce:** What actions led to the issue? What commands did you run, and in what sequence?
- **Expected behavior:** What were you expecting to happen?
- **Actual behavior:** What actually happened? Be specific.
- **Screenshots or error logs:** Attach any relevant screenshots or error logs to help us understand the problem.

### 3. **Environment**

Include details about your environment such as:

- Operating system (e.g., macOS, Windows, Linux)
- Node.js version
- Other relevant versions (e.g., Express, Mongoose)

### 4. **Labels**

When submitting an issue, please try to include appropriate labels such as:

- `bug` for problems or errors
- `feature` for feature requests
- `documentation` for documentation-related issues

## Example Issue Report

Here's an example of how a well-structured issue should look:

### Title:

`Model creation fails when running 'microflame generate model user'`

### Description:

I tried running the command `microflame generate model user`, but the model file was not created. The error message I received is:

### Steps to Reproduce:

1. Run `microflame generate model user` command
2. Observe that no model file is generated

### Expected Behavior:

The model file should be created under the `/models` directory.

### Actual Behavior:

No file is created, and the terminal shows an error.

### Environment:

- OS: macOS 11.5
- Node.js: v14.17.0
- MicroFlame Version: 1.0.0

---

Once an issue is reported, I will review it, investigate, and handle the resolution. You can track the status of your issue in the GitHub Issues section.

Thank you for your contributions to making MicroFlame better!
