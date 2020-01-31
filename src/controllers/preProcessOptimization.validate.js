import * as yup from 'yup'
import { BadRequest } from '../errors/clientError'

export default async input => {
  const schema = yup.object().shape({
    areaCode: yup.string().required(),
    appointmentDate: yup.string().required()
  })

  const valid = await schema.isValid(input)

  if (!valid) {
    try {
      await schema.validate(input)
    } catch (err) {
      throw new BadRequest(err.errors)
    }
  }
}
