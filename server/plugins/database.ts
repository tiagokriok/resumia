import { connect, plugin, set } from 'mongoose'
import { Nitro } from 'nitropack'

export default async (_nitroApp: Nitro) => {
  try {
    const config = useRuntimeConfig()

    set('debug', true)
    set('toObject', {
      getters: true,
      transform: (_, ret) => {
        delete ret?.__v
        delete ret?._id
        return ret
      },
    })

    plugin((schema) => {
      schema.pre(/^update/, function () {
        // @ts-ignore
        this.projection({ _id: 0, ...(this?._fields && this._fields) })
        this.lean()
      })

      schema.pre(/^find/, function () {
        // @ts-ignore
        this.projection({ _id: 0, ...(this?._fields && this._fields) })
        this.lean()
      })

      schema.pre(/^delete/, function () {
        // @ts-ignore
        this.projection({ _id: 0, ...(this?._fields && this._fields) })
        this.lean()
      })

      schema.pre(/^insert/, function () {
        // @ts-ignore
        this.projection({ _id: 0, ...(this?._fields && this._fields) })
        this.lean()
      })
    })

    await connect(config.mongodbUri)
    console.info('Connected to MongoDB')
  } catch (e) {
    console.error(e)
  }
}
