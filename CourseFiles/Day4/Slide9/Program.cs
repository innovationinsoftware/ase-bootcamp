using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
namespace BlobsDemo
{
    class Program
    {

        private const string blobStorageConnectionString = "DefaultEndpointsProtocol=https;AccountName=storageinnovation;AccountKey=yAj2hFTmEkBaXfRTB20RppibQkQpjqhqt6HJDuE6wC48tn1cK/Shb5YKnfOYnyBQ+G3uZnqx8S/s+AStF7RV5g==;EndpointSuffix=core.windows.net";
        private const string blobContainerName = "containerblobeventhubs";
        static async Task Main()
        {
            Console.WriteLine("Code started running");

            // Create a blob container client that the event processor will use
            BlobContainerClient storageClient = new BlobContainerClient(blobStorageConnectionString, blobContainerName);
            // Create an event processor client to process events in the event hub

            Console.WriteLine("About to send files to blobs");
            // Start sending files

            await UploadFromFileAsync(storageClient, ".\\");
            await Task.Delay(TimeSpan.FromSeconds(10));

            Console.WriteLine("Finished processing");


        }
        public static async Task UploadFromFileAsync(
        BlobContainerClient containerClient,
        string localFilePath)
        {
            string[] fileEntries = Directory.GetFiles(localFilePath);
            foreach (string fileName in fileEntries)
            {
                BlobClient blobClient = containerClient.GetBlobClient(fileName);
                Console.WriteLine("Uploading file:" + fileName);

                await blobClient.UploadAsync(fileName, true);
            }
        }
    }
}

