FROM node:16 AS build-frontend

WORKDIR /app
COPY ./src/package.json ./src/package-lock.json ./
RUN npm install
COPY ./src/index.html ./public/
COPY ./src/index.css ./public/
COPY ./src/*.js ./public/
COPY ./src/ ./src
RUN npm run build && npm install -g npm@latest npx@latest
FROM python:3.9
WORKDIR /code
COPY ./RAIChU /code/RAIChU

# Install the package using pip
RUN pip install /code/RAIChU
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./Backend /code/app
COPY --from=build-frontend /app/build /code/app/static
COPY --from=build-frontend /usr /usr 

# Expose the port that the FastAPI application is listening on
EXPOSE 8000
EXPOSE 3000

# Start the FastAPI application
CMD npx serve -l 3000 /code/app/static & \
    uvicorn app.main:app --host 0.0.0.0 --port 8000

