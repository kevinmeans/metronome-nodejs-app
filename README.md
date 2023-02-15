# metronome-nodejs-app

This is the nodeJS HTTP interface that the metronome-python code connects to.  NodeJS code can be found in the index.js file.  The mysql queriues can be found here.  There are two API end points, one that inserts data and one that retrieves the take home ask based off of customer_id, start and end time.  The NodeJS server is built via Docker and pushed to my own dockerhub image repo.  Commands used to build the image:

docker build -t kevmeans/metronome-node-app:2 .
docker push kevmeans/metronome-node-app:2


The image will be pulled via the kubernetes repo during creation time.
