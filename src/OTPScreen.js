import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
export default class OTPScreen extends Component {
    constructor(props) {
        super(props);
          this.state = {
            newOtp: '',
            isLoading: false,
            resendButtonDisabledTime: 30,
            mobileNumber:'8821016902'
        };
        }
    startListeningForOtp = () => {
        RNOtpVerify.getOtp()
            .then(p => {
                console.log("000p--tuw==>", p)
                RNOtpVerify.addListener(message => {
                    console.log("message-->",message)
                    if (message) {
                        console.log("--message-->", message)
                    }
                        
                })
            })
            .catch(p => console.log(p));
    }

componentDidMount=()=>{
    
//    this.startListeningForOtp();
    this.startResendOtpTimer();

  }
    startResendOtpTimer = () => {
      
          const resendOtpTimerInterval = setInterval(() => {
              if (this.state.resendButtonDisabledTime <= 0) {
                  clearInterval(resendOtpTimerInterval)
                  console.log("------",this.state.resendButtonDisabledTime )
                  console.log("--Done-")
              } else {
                  this.setState({ resendButtonDisabledTime: this.state.resendButtonDisabledTime - 1 })
       
              }
          }, 1000);
     
  };
    onResendOtp = () => {
        this.startResendOtpTimer();
        console.log("-------------------------click")
        this.setState({ resendButtonDisabledTime: 10 })
        this._onSmsListenerPressed();
        this.startResendOtpTimer();
  }

  onVarify = (otp) => {
console.log("--------otp-->",otp)
    if (this.state.userOtp) {
      this.setState({
        isLoading: true
      })
      const { userMobileNo } = this.props.route.params;
      console.log(UserAuthBaseUrl + 'API/OTPVerification/GetOtpVerification')
      console.log(JSON.stringify({
        MobileNo: userMobileNo,
        GeneratedOTP: this.state.userOtp
      }))
      fetch(UserAuthBaseUrl + 'API/OTPVerification/GetOtpVerification', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          MobileNo: userMobileNo,
          GeneratedOTP: this.state.userOtp
        })
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json.successcode == "1") {
            this.setState({
              isLoading: false
            })
            
            this.storeData(json.data[0])
            this.props.navigation.navigate("AppDrawerScreen")
            //this.props.navigation.navigate("Login")
          } else {
            this.setState({
              isLoading: false
            })
            alert('OTP mis match')
            this.props.navigation.navigate("OtpVarification")
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    


   

  }
  storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        //alert(jsonValue)
        await AsyncStorage.setItem('userinfo', jsonValue)
    } catch (e) {
        // saving error
    }
}

  onResendOtp = () => {
    this.setState({
      isLoading: true
    })
    const { userMobileNo } = this.props.route.params;
    fetch(UserAuthBaseUrl + 'API/OTPVerification/ResentOTP?MobileNo=' + userMobileNo, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.successcode == "1") {
          this.setState({
            isLoading: false,
            newOtp: json.data[0].GeneratedOTP
          })
          alert('OTP Sent Successfully')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
          
        <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: 'https://lh3.googleusercontent.com/BJC4uppMdeo8ue2Eh9IlVxtAVJPRsgVySNMgIeXOCRDxbDcyRznXAPzdJ_Ql36TF3w',
                        }}
          />
          <View style={{width:'80%'}}>
    <Text style={{ fontSize: 18, marginTop: 30, textAlign: 'center',fontWeight:'bold' }}>One Time Password (OTP) has been sent to this  number {this.state.mobileNumber}</Text>
        </View>
        
        </View>
        <View style={{
          justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange', flex: 1,
          borderTopStartRadius: 70, 
          borderTopRightRadius: 70

        }}>
          <Text  style={{ fontSize: 18,textAlign: 'center',fontWeight:'bold' }}>
            Enter Verification Code
          </Text>
        
            <View style={{height:'20%',width:'80%',backgroundColor:'transprent',marginTop:'5%'}}>
                <OTPInputView pinCount={6}
                 
              autoFocusOnLoad={true}
                    keyboardType="number-pad"
                 
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={{ borderColor: 'green', borderWidth: 2 }}
                    onCodeFilled = {(code => {
                      this.onVarify(code);
                    })}
                />
            </View>

            {this.state.resendButtonDisabledTime <= 0 ? 
                
              <Text
              onPress={this.onResendOtp}
                    style={{ textAlign: 'center', fontSize: 20, color: 'green', marginTop: 10,fontWeight:'bold',letterSpacing:1   }}>Resend OTP</Text> :
                    <Text
                  
                    style={{ textAlign: 'center', fontSize:17, color: 'black', marginTop: 10,fontWeight:'bold',letterSpacing:1  }}>Resend OTP in { this.state.resendButtonDisabledTime}s</Text>}
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 140,
    height: 140,
  },
  
    underlineStyleBase: {
        width: 35,
        height: 45,
        borderWidth: 1,
        borderColor: 'black',
        color: '#ffffff',
      fontSize: 20,
        fontWeight:'bold'
     
      },

container: {
 flex:1
},
otpContainer: {
  marginTop: 50, marginBottom: 30, borderColor: '#d7d7d7',
  borderWidth: 1,
  borderRadius: 30,
  borderBottomWidth: 5,
  width: '50%',
},
//   header: {
//     flex: ,
//     backgroundColor: "red",
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     // paddingVertical: 20,
//     // paddingHorizontal: 20
// },
showOtp: {
  height: 30,
  textAlign: 'center',
  fontSize: 22
},

button: {
  paddingTop: 8,
  paddingBottom: 8,
  marginLeft: 30,
  marginRight: 30,
  backgroundColor: '#bf1313',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#fff',
  marginBottom: 20,
  width: '80%'
},
TextStyle: {
  color: '#fff',
  textAlign: 'center',
  fontSize: 15
},

})



// <View style={styles.container}>
// <View style={{width:'80%'}}>
// <Text style={{ fontSize: 18, marginTop: 30, textAlign: 'center' }}>One Time Password (OTP) has been sent to this  number {this.state.mobileNumber}</Text>
// </View>

//     <View style={{height:'20%',width:'90%',backgroundColor:'transprent'}}>
//         <OTPInputView pinCount={6}
         
//       autoFocusOnLoad={true}
//             keyboardType="number-pad"
         
//             codeInputFieldStyle={styles.underlineStyleBase}
//             codeInputHighlightStyle={{ borderColor: 'green', borderWidth: 2 }}
//             onCodeFilled = {(code => {
//               this.onVarify(code);
//             })}
//         />
//     </View>

//     {this.state.resendButtonDisabledTime <= 0 ? 
        
//       <Text
//       onPress={this.onResendOtp}
//             style={{ textAlign: 'center', fontSize: 20, color: 'green', marginTop: 10 }}>Resend OTP</Text> :
//             <Text
          
//             style={{ textAlign: 'center', fontSize:17, color: 'black', marginTop: 10 }}>Resend OTP in { this.state.resendButtonDisabledTime}s</Text>}

// </View>