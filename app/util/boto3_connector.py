import boto3


class BirbBoto3:

    def __init__(self, bucket_name="jazzbirb-bird"):

        self.s3_client = boto3.client('s3')
        self.bucket_name = bucket_name

    def create_presigned_url(self, object_name, expiration=60*60*24):
        """Generate a presigned URL to share an S3 object

        :param bucket_name: string
        :param object_name: string
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. If error, returns None.
        """

        # Generate a presigned URL for the S3 object


        response = self.s3_client.generate_presigned_url('get_object',
                                                        Params={'Bucket': self.bucket_name,
                                                                'Key': object_name},
                                                        ExpiresIn=expiration)

        return response


    def upload_image(self, file_obj, file_name):
        ret = self.s3_client.put_object(Body=file_obj,
                                            Key=file_name,
                                            Bucket=self.bucket_name)

        return ret
        # with open("0080_001.jpg", 'rb') as f:
        #     self.s3_client.put_object(Body=f,
        #                   Bucket='jazzbirb-bird',
        #                   Key='put_object.jpg')

        # with open("0080_001.jpg", 'rb') as f:
        #     self.s3_client.upload_fileobj(Fileobj=file_obj,
        #                                   Key=file_obj,
        #                                   Bucket=self.bucket_name)


if __name__ == "__main__":

    ret = BirbBoto3().create_presigned_url('jazzbirb-bird', 'gyb0418/14.png')
    print(ret)
    # print(ret)


