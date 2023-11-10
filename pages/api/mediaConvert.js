const {
  MediaConvertClient,
  CreateJobCommand,
  DescribeEndpointsCommand,
} = require("@aws-sdk/client-mediaconvert");

// Initialize MediaConvert client without the endpoint
const mediaconvert = new MediaConvertClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "ap-northeast-1",
  endpoint: "https://1muozxeta.mediaconvert.ap-northeast-1.amazonaws.com",
});

export async function createMediaConvertJob(inputUrl) {
  const params = {
    // Job settings go here
    Role: "arn:aws:iam::546724192758:role/mp4toTs",
    Settings: {
      Inputs: [
        {
          FileInput: inputUrl,
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
              // Other audio selector settings as needed
            },
          },
        },
      ],
      OutputGroups: [
        {
          Name: "Apple HLS",
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              Destination: "s3://clips-queue/tssegments/",
              MinSegmentLength: 0,
              SegmentLength: 10, // Length of each TS segment in seconds
            },
          },
          Outputs: [
            {
              NameModifier: "_1",
              // Specify codec settings, etc.
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  // M3U8 specific settings
                },
              },
              VideoDescription: {
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    // Example settings - adjust as needed
                    RateControlMode: "QVBR",
                    QvbrSettings: {
                      QvbrQualityLevel: 7,
                    },
                    CodecProfile: "HIGH",
                    CodecLevel: "LEVEL_4_1",
                    GopSize: 2, // 2 seconds
                    MaxBitrate: 5000000,
                    GopSizeUnits: "SECONDS",
                    InterlaceMode: "PROGRESSIVE",
                  },
                },
                Width: 1280,
                Height: 720,
                // Other settings like scaling behavior, etc.
              },
              AudioDescriptions: [
                {
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      // Example settings - adjust as needed
                      SampleRate: 48000,
                      Bitrate: 64000,
                      CodingMode: "CODING_MODE_2_0",
                    },
                  },
                  // Other audio settings as needed
                },
              ],
              // You can add more settings such as captions, etc.
            },
          ],
        },
      ],
    },
  };

  const createJobCommand = new CreateJobCommand(params);

  try {
    const data = await mediaconvert.send(createJobCommand);
    console.log("Success", data.Job);
  } catch (err) {
    console.error("Error", err);
  }
}
