import { Toast } from 'vant'
const MyNotify = ({ type, message }) => {
  //   Notify({
  //     type: type,
  //     message: message
  //   })

  if (type === 'warning') {
    Toast({
      type: 'fail',
      message
    })
  } else if (type === 'success') {
    Toast({
      type,
      message
    })
  }
}

export default MyNotify
