# 1. Use 'bookworm' (Debian 12) instead of 'alpine'. 
# This contains the heavy system libraries Playwright needs to run browsers.
FROM node:20-bookworm

# 2. Set the working directory inside your container
WORKDIR /

# 3. Copy only the package files first.
# We do this before copying your code so Docker can cache the 'npm install' step.
COPY package*.json ./

# 4. Install your Node dependencies (Express, Playwright, Gemini, etc.)
RUN npm install

# 5. Install Playwright browser dependencies.
# We only install Chromium to keep the image size from becoming massive.
RUN npx playwright install --with-deps chromium

# 6. Copy the rest of your backend code (workflow.js, etc.) into the container
COPY . .

# 7. Expose the port your Express server uses 
# (Assume 3000, but change this if your Express app uses a different port)
EXPOSE 3000

# 8. Start the backend using the "done" script you defined in your package.json
CMD ["npm", "run", "done"]