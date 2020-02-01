import AWS from 'aws-sdk'
import { join } from 'path'

import config from '../../config'

const s3 = new AWS.S3({
  accessKeyId: config.aws.s3.accessKeyId,
  secretAccessKey: config.aws.s3.secretAccessKey,
  region: config.aws.s3.region
})

/**
 * upload json file by json object data to S3 bucket
 *
 * @param {string} bucketName - A existing S3 bucket name on AWS
 * @param {string=} keyPrefix - Optional Folder name to create in selected S3 bucket
 * @param {string} fileName - filename with .json extension
 * @param {Object} data - JSON object data
 * @returns {Promise} S3 bucket upload result object : Success => ETag, Location, key, Bucket
 *
 * @example
 *
 *     uploadJsonToS3(
 *          'prepare-optimization',
 *          '12345',
 *          '01_02_2020.json',
 *          JSON.stringify({ locations: 'bkk' })
 *     )
 *
 */

export const uploadJsonToS3 = (bucketName, keyPrefix, fileName, data) => {
  const keyName = join(keyPrefix, fileName)
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucketName,
        Key: keyName,
        ContentType: 'application/json; charset=utf-8',
        // ACL: 'public-read',
        Body: data
      },
      (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      }
    )
  })
}
