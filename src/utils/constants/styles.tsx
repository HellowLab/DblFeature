import { StyleSheet } from "react-native";
// import useThemeContext from "../utils/contexts/useThemeContext";
// import { useThemeColor } from "@/components/Themed";

// const colors = useThemeColor();

export const myStyles = StyleSheet.create({
  // Component Styles (inputs, buttons, boxes, etc)
  // textInputAtom: {
  //     flex: 1,
  //     paddingLeft: 15,
  //     paddingRight: 15,
  //     borderWidth: 1,
  //     borderRadius: 30,
  //     height: 40,
  //     color: colors.colorname.text, // text color
  //     borderColor: colors.backgrounds.inverted, 
  // },
  buttonStyle: {
      // backgroundColor: colors.backgrounds.primary,
      backgroundColor: '#0284c7',
      borderWidth: 0,
      // color: '#FFFFFF',
      // borderColor: '#7DE24E',
      height: 40,
      alignItems: 'center',
      borderRadius: 3,
    },
  // activityIndicator: {
  //   alignItems: 'center',
  //   height: 80,
  // },
  // boxStyle1: {
  //   backgroundColor: colors.backgrounds.soft,
  //   padding: 10,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
    

  // // Text Styles
  // standardText: {
  //   color: colors.text,
  //   textAlign: 'center',
  //   fontSize: 18,
  //   padding: 30,
  // },
  // boldText: {
  //   color: colors.text,
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  // standardText1: {
  //   color: colors.text,
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
  // standardText2: {
  //   color: colors.text,
  //   fontSize: 14,
  // },
  // headerText: {
  //   color: colors.text,
  //   fontSize: 25
  // },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 16,
  },
  // registerTextStyle: {
  //   color: colors.text,
  //   textAlign: 'center',
  //   // fontWeight: 'bold',
  //   fontSize: 16,
  //   alignSelf: 'center',
  //   padding: 10,
  // },
  // errorTextStyle: {
  //   color: 'red',
  //   textAlign: 'center',
  //   fontSize: 14,
  // },

  // Image Styles
  logo: {
    width: 175, // Adjust the width of the logo as needed
    height: 175, // Adjust the height of the logo as needed
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },

  // Section styles
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: colors.backgrounds.default, 
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  SectionStyle1: {
    flex: 1, 
    padding: 16,
    // backgroundColor: colors.backgrounds.default, 
  },
  LogoStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // height: 40,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 35,
    marginRight: 35,
    // margin: 10,
  },
  pageHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    minHeight: 50,
    maxHeight: 50,
    // backgroundColor: colors.backgrounds.soft,
  },


  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
})