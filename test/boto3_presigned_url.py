import boto3

def create_presigned_url(bucket_name, object_name, expiration=30):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')

    response = s3_client.generate_presigned_url('get_object',
                                                Params={'Bucket': bucket_name,
                                                        'Key': object_name},
                                                ExpiresIn=expiration)

    s3_client.gene

    # The response contains the presigned URL
    return response


ret = create_presigned_url('jazzbirb-bird', '0080_001.jpg')
print(ret)

# https://jazzbirb-bird.s3.amazonaws.com/0080_001.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAW5ZLKNDDLVQKZSCM%2F20220205%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220205T111519Z&X-Amz-Expires=30&X-Amz-SignedHeaders=host&X-Amz-Signature=f594d45fed5c503712e3e1a18ac1f8cc800aaa5c506a8e970880913c8e85bc03
