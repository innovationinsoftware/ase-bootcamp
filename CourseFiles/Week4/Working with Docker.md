# Working with Docker

In this lab, you learn how to:

- Create a Docker container.
- Build a container image.
- Start an app container.



## Prerequisites

- Docker VS Code Extension installed.
- Docker Desktop is configured to use Linux containers.
- A [Docker Hub](https://hub.docker.com/signup) account. You can create an account for free.

The lab works with Windows 10 or later, and Docker Desktop configured to use Linux containers.



## Create a container

A container is a process on your computer. It's isolated from all other processes on the host computer. That isolation uses kernel namespaces and control groups.

A container uses an isolated filesystem. This custom filesystem is provided by a *container image*. The image contains everything needed to run an application, such as all dependencies, configuration, scripts, and binaries. The image also contains other configuration for the container, such as environment variables, a default command to run, and other metadata.

After you install the Docker extension for VS Code, you can work with containers in VS Code. In addition to context menus in the Docker pane, you can select **Terminal** > **New Terminal** to open a command-line window. You can also run commands in a Bash window. Unless specified, any command labeled as **Bash** can run in a Bash window or the VS Code terminal.

1. Set Docker to Linux container mode. To switch to Linux containers if you are currently set to Windows containers, right-click on the Docker icon in the system tray while Docker Desktop is running, and choose **Switch to Linux containers**.

2. In VS Code, select **Terminal** > **New Terminal**.

3. In the terminal window or a Bash window, run this command.

   ```bash
   docker run -d -p 80:80 docker/getting-started
   ```

   This command contains the following parameters:

   - `-d` Run the container in detached mode, in the background.
   - `-p 80:80` Map port 80 of the host to port 80 in the container.
   - `docker/getting-started` Specifies the image to use.

   **Tip**

   You can combine single-character flags to shorten the whole command. As an example, the command above could be written as:

   ```bash
   docker run -dp 80:80 docker/getting-started
   ```

4. In VS Code, select the Docker icon on the left to view the Docker extension.

   ![Screenshot shows the Docker extension with the docker/getting-started tutorial running.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/vs-tutorial-docker-extension.png)

   The Docker VS Code Extension shows you the containers running on your computer. You can access container logs and manage container lifecycle, such as stop and remove.

   The container name, **modest_shockley** in this example, is randomly created. Yours will have a different name.

5. Right-click on **docker/getting-started** to open a context menu. Select **Open in Browser**.

   Alternatively, open a browser and enter `http://localhost/tutorial/`.

   You'll see a page hosted locally about DockerLabs.

6. Right-click on **docker/getting-started** to open a context menu. Select **Remove** to remove this container.

   To remove a container by using the command line, run this command to get its container ID:

   ```bash
   docker ps
   ```

   Then stop and remove the container:

   ```bash
   docker stop <container-id>
   docker rm <container-id>
   ```

7. Refresh your browser. The Getting Started page you saw a moment ago is gone.



## Build a container image for the app

This tutorial uses a simple Todo application.

![Screenshot shows the sample application with several items added and a text box and button to add new items.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/todo-list-sample.png)

The app allows you to create work items and to mark them as completed or delete them.

To build the application, create a Dockerfile. Apt of instruction Dockerfile is a text-based scris used to create a container image.

1. Go to the [Docker Getting Started Tutorial](https://github.com/docker/getting-started) repo and select **Code** > **Download ZIP**. Extract the contents to a local folder.

   ![Screenshot shows part of the Github site, with the green Code button and Download ZIP option highlighted.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/download-zip.png)

2. In VS Code, select **File** > **Open Folder**. Navigate to the *app* folder in the extracted project and open that folder. You should see a file called *package.json* and two folders *src* and *spec*.

   ![Screenshot of Visual Studio Code showing the package.json file open with the app loaded.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/ide-screenshot.png)

3. Create a file named *Dockerfile* in the same folder as the file *package.json* with the following contents.

   ```dockerfile
   FROM node:20-alpine
   RUN apk add --no-cache python3 g++ make
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD ["node", "/app/src/index.js"]
   ```

   **Note**

   Be sure that the file has no file extension like `.txt`.

4. In the file explorer, on the left in VS Code, right-click the *Dockerfile* and then select **Build Image**. Enter *getting-started* as the tag for the image in the text entry box.

   The tag is a friendly name for the image.

   To create a container image from the command line, use the following command from the `app` folder that has the *Dockerfile*.

   ```bash
   docker build -t getting-started .
   ```

You've used the *Dockerfile* to build a new container image. You might have noticed that many "layers" were downloaded. The *Dockerfile* starts from the `node:20-alpine` image. Unless that image was on your computer already, that image needed to be downloaded.

After the image is downloaded, the *Dockerfile* copies your application and uses `yarn` to install your application's dependencies. The `CMD` value in the *Dockerfile* specifies the default command to run when starting a container from this image.

The `.` at the end of the `docker build` command tells that Docker should look for the *Dockerfile* in the current directory.



## Start your app container

Now that you have an image, you can run the application.

1. To start your container, use the following command.

   ```bash
   docker run -dp 3000:3000 getting-started
   ```

   The `-d` parameter indicates that you're running the container in detached mode in the background. The `-p` value creates a mapping between the host port 3000 and the container port 3000. Without the port mapping, you couldn't access the application.

2. After a few seconds, in VS Code, in the Docker area, under **CONTAINERS**, right-click **getting-started** and select **Open in Browser**. Alternatively, you can open your web browser to `http://localhost:3000`.

   You should see the app running.

   ![Screenshot shows the sample app with no items and the text No items yet Add one above.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/todo-list-empty.png)

3. Add an item or two to test if it works as you expect. You can mark items as complete and remove them. Your front end is successfully storing items in the backend.



## Next steps

Congratulations! You now have a running to-do list manager with a few items. You've also learned to create container images and run a containerized app.

Keep everything you've done so far for the next section.



## Share a Docker app with Visual Studio Code

In this tutorial, you learn how to:

- Update the code and replace the container.
- Share your image.
- Run the image on a new instance.



## Update the code and replace the container

Let's make a few changes and learn about managing your containers.

1. In the `src/static/js/app.js` file, update line 56 to use this new text label:

   

   ```diff
   - <p className="text-center">No items yet! Add one above!</p>
   + <p className="text-center">You have no todo items yet! Add one above!</p>
   ```

   Save your change.

2. Stop and remove the current version of the container. More than one container can't use the same port.

   Right-click the **getting-started** container and select **Remove**.

   ![Screenshot shows the Docker extension with a container selected and a context menu with Remove selected.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/vs-remove-container.png)

   Or, from the command line, use the following command to get the container ID.

   ```bash
   docker ps
   ```

   Then stop and remove the container:

   ```bash
   docker stop <container-id>
   docker rm <container-id>
   ```

3. To build the updated version of the image, right-click *Dockerfile* in the file explorer and select **Build Image**.

   Or, to build on the command line, change to the folder that contains the Dockerfile, and use the same command you used before.

   ```bash
   docker build -t getting-started .
   ```

4. Start a new container that uses the updated code.

   ```bash
   docker run -dp 3000:3000 getting-started
   ```

5. Refresh your browser on `http://localhost:3000` to see your updated help text.

   ![Screenshot shows the sample application with the modified text, described above.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/todo-list-updated-empty-text.png)



## Share your image

Now that you've built an image, you can share it. To share Docker images, use a Docker registry. The default registry is Docker Hub, from which all of the images we've used have come.

First, you need to create a repo on Docker Hub to push an image.

1. Go to [Docker Hub](https://hub.docker.com/) and sign in to your account.

2. Select **Create Repository**.

3. For the repo name, enter `getting-started`. Make sure that the **Visibility** is **Public**.

4. Select **Create**.

   On the right of the page, you'll see a section named **Docker commands**. This section gives an example command to run to push to this repo.

   ![Screenshot shows the Docker Hub page with a suggested Docker command.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/push-command.png)

5. In VS Code, in the Docker view, under **REGISTRIES**, click the plug icon to connect to a registry and choose **Docker Hub**.

   Enter your Docker Hub account name and password.

6. In the Docker view of VS Code, under **IMAGES**, right-click the image tag, and select **Push**. Enter the namespace and the tag, or accept the defaults.

7. To push to Docker Hub by using the command line, use this procedure.

   Sign in to the Docker Hub:

   ```bash
   docker login -u <username>
   ```

8. Use the following command to give the *getting-started* image a new name.

   ```bash
   docker tag getting-started <username>/getting-started
   ```

9. Use the following command to push your container.

   ```bash
   docker push <username>/getting-started
   ```



## Run the image on a new instance

Now that your image has been built and pushed into a registry try running the app on a brand-new instance that has never seen this container image. To run your app, use Play with Docker.

1. Open your browser to [Play with Docker](http://play-with-docker.com/).

2. Sign in with your Docker Hub account.

3. Select **Start** and then select the **+ ADD NEW INSTANCE** link in the left side bar. After a few seconds, a terminal window opens in your browser.

   ![Screenshot shows the Play with Docker site with an add new instance link.](https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/media/play-with-docker-add-new-instance.png)

4. In the terminal, start your app.

   ```bash
   docker run -dp 3000:3000 <username>/getting-started
   ```

   Play with Docker pulls down your image and starts it.

5. Select the **3000** badge next to **OPEN PORT**. You should see the app with your modifications.

   If the **3000** badge doesn't appear, select **OPEN PORT** and enter 3000.



## Congratulations!

You’ve successfully built a Docker image, updated the application code, rebuilt the image, pushed it to a Docker registry, and deployed it to a different host. Throughout this process, you’ve gained valuable skills in creating and managing Docker images, efficiently applying updates, and deploying containerized applications across multiple environments. These foundational skills are crucial for automating workflows, improving scalability, and maintaining consistency between development and production environments.

In upcoming labs, you’ll explore how to persist data in containerized applications, cache dependencies for faster builds, use multi-stage builds to optimize and streamline container images, and manage multi-container applications with Docker Compose.