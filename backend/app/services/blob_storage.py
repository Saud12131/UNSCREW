import os 
import uuid
from azure.storage.blob import BlobServiceClient, ContentSettings

#content to azure blob

blob_service = BlobServiceClient.from_connection_string(
    os.getenv("AZURE_BLOB_CONNECTION_STRING")
)

container_client = blob_service.get_container_client("aiinterviewerblob01")

def upload_audio_to_blob(audio_bytes:bytes)-> str:
    """
    Uploads audio bytes to Azure Blob
    Returns public blob URL
    """
    filename = f"{uuid.uuid4()}.wav"
    blob_client = container_client.get_blob_client(filename)
    blob_client.upload_blob(
        audio_bytes,
        overwrite=True,
        content_settings=ContentSettings(
            content_type="audio/wav"
        )
    )
    return blob_client.url
