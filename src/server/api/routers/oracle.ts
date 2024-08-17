import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "../../../env";
import { common, objectstorage } from "oci-sdk";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const base64String = env.ORACLE_S3_KEY_FILE_ENCODED;
const decodedString = Buffer.from(base64String, "base64").toString("utf-8");
const tenancy = env.ORACLE_S3_TENANCY;
const user = env.ORACLE_S3_USER;
const fingerprint = env.ORACLE_S3_FINGERPRINT;
const namespaceName = env.ORACLE_NAMESPACE_NAME;

const sprovider = new common.SimpleAuthenticationDetailsProvider(
  tenancy,
  user,
  fingerprint,
  decodedString,
  "", // pasphrase
  common.Region.EU_JOVANOVAC_1,
);

const oracleObjectStorageClient = new objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: sprovider,
});

/*
const getNamespaceRequest: objectstorage.requests.GetNamespaceRequest = {};
const namespace =
  await oracleObjectStorageClient.getNamespace(getNamespaceRequest);
console.log("**************************************");
console.log(namespace.value);
console.log("**************************************");
*/

export const oracleRouter = createTRPCRouter({
  getImage: publicProcedure.input(z.string()).query(async ({ input }) => {
    const now = new Date().getTime();
    try {
      const createPreauthenticatedRequestDetails = {
        name: uuidv4(),
        objectName: input,
        accessType:
          objectstorage.models.CreatePreauthenticatedRequestDetails.AccessType
            .AnyObjectRead,
        timeExpires: new Date(now + 5 * 60 * 1000),
      };

      const createPreauthenticatedRequestRequest: objectstorage.requests.CreatePreauthenticatedRequestRequest =
        {
          namespaceName: namespaceName,
          bucketName: "bucket-aimambo-images",
          createPreauthenticatedRequestDetails:
            createPreauthenticatedRequestDetails,
        };
      const createPreathenticatedRequestResponse =
        await oracleObjectStorageClient.createPreauthenticatedRequest(
          createPreauthenticatedRequestRequest,
        );
      const url =
        createPreathenticatedRequestResponse.preauthenticatedRequest.fullPath;
      return { url: url + input };
    } catch (error) {
      throw new Error(
        `Failed to generate signed URL: ${(error as Error).message}`,
      );
    }
  }),

  getHeatmap: publicProcedure.input(z.string()).query(async ({ input }) => {
    const now = new Date().getTime();
    try {
      const createPreauthenticatedRequestDetails = {
        name: uuidv4(),
        objectName: input,
        accessType:
          objectstorage.models.CreatePreauthenticatedRequestDetails.AccessType
            .AnyObjectRead,
        timeExpires: new Date(now + 5 * 60 * 1000),
      };

      const createPreauthenticatedRequestRequest: objectstorage.requests.CreatePreauthenticatedRequestRequest =
        {
          namespaceName: namespaceName,
          bucketName: "bucket-aimambo-heatmaps",
          createPreauthenticatedRequestDetails:
            createPreauthenticatedRequestDetails,
        };
      const createPreathenticatedRequestResponse =
        await oracleObjectStorageClient.createPreauthenticatedRequest(
          createPreauthenticatedRequestRequest,
        );
      const url =
        createPreathenticatedRequestResponse.preauthenticatedRequest.fullPath;
      return { url: url + input };
    } catch (error) {
      throw new Error(
        `Failed to generate signed URL: ${(error as Error).message}`,
      );
    }
  }),
});
