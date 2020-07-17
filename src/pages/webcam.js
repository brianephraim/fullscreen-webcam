import React, {PureComponent} from "react"
import { Link } from "gatsby"
import injectSheet from 'react-jss';
// import { withPrefix } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ChromeLogo from "../components/ChromeLogo"

console.log('injectSheet',injectSheet);

const withPrefix = (str) => str;
const buttonStyleBase = {
  borderRadius: 5,
  backgroundColor: '#ccc',
  marginTop:5,
  marginBottom:5,
  cursor: 'pointer',
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 10,
  paddingLeft: 10,
};
const styles = {
  h1: {
    fontSize: 50,
    color: 'green',
  },
  deviceSelectorPresser: {
    ...buttonStyleBase,
    backgroundColor: '#eee',
  },
  deviceSelector: {
    display: 'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    marginBottom: 20,
    backgroundColor:'#ddd',
    padding:20,
  },
  webcamVideo: {
    width: '100%',
    transform: 'scale(-1, 1)',
  },
  webcamVideoContainer: {
    display: 'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
    borderStyle: 'solid',
    padding: 20,
  },
  fullscreenButton: {
    ...buttonStyleBase,
    alignSelf: 'flex-start',
    backgroundColor:'#444',
    color:'#fff',
  },
  chromeLogoContainer: {
    width:60,
  },
  worksBestInChromeContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  worksBestInChromeText: {
    marginBottom:0,
    marginLeft: 10,
  },
  toggleWebcamButton: {
    marginTop:30,
    marginBottom:30,
    borderWidth:5,
    borderStyle:'solid',
    borderColor:'orange',
    color:'orange',
    textAlign:'center',
    fontSize:30,
    padding:30,
    fontWeight:'bold',
    borderRadius: 18,
    cursor: 'pointer',
  },
  stepContainer: {
    backgroundColor:'#ddd',
    margin:20,
    padding:20,
  },
  videoContainer: {
  },
};

const noop = () => null;
class Presser extends PureComponent {
  static defaultProps = {
    onPress: noop
  };
  onClick = () => {
    this.props.onPress(this.props.value);
  };
  render(){
    const {onPress, ...remainingProps} = this.props;
    return (
      <div onClick={this.onClick} {...remainingProps} />
    );
  }
}

const emptyArray = [];

const defaultConstraints = {
  audio: false,
  video: true
};
class WebcamVideo_notConnected extends PureComponent {
  async componentDidMount(){
    this.keydownHandler = (event) => {
      var key = event.key; // Or const {key} = event; in ES6+

      if (key === "Escape") {
        this.togglefullscreen();
      }
    }
    document.addEventListener('keydown', this.keydownHandler);

    try {
      await this.updateVideoRefAttributes();
    } catch(err){
      alert("yikes, and err!" + err.message);
    }
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', this.keydownHandler);
  }

  async updateVideoRefAttributes(){
    const mediaStream = await navigator.mediaDevices.getUserMedia(this.makeConstraints(this.props.selectedDevice));
    this.videoRef.srcObject = mediaStream;
    this.videoRef.play();
  }
  makeConstraints(selectedDevice = null){
    if (!selectedDevice) {
      return defaultConstraints;
    }
    return {
      audio: false,

      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
        deviceId:selectedDevice.deviceId
        // width: 320, height: 240,
        // resizeMode:'none',
        // sourceId: selectedDevice.deviceId,

        // optional: [
        //   {
        //     sourceId: selectedDevice.deviceId,
        //
        //   },
        //
        // ]
      },
      // deviceId:selectedDevice.deviceId
      // deviceId: {
      //   exact: selectedDevice.deviceId
      // }
    };
  }
  async componentDidUpdate(prevProps,prevState){
    console.log(prevProps,this.props);
    if (prevProps.selectedDevice !== this.props.selectedDevice){
      await this.updateVideoRefAttributes();
    }
  }


  enterFullscreen = () => {
    if (this.videoContainerRef.requestFullscreen) {
      this.videoContainerRef.requestFullscreen(); // W3C spec
    } else if (this.videoRef.mozRequestFullScreen) {
      this.videoContainerRef.mozRequestFullScreen(); // Firefox
    } else if (this.videoRef.webkitRequestFullscreen) {
      this.videoContainerRef.webkitRequestFullscreen(); // Safari
    } else if (this.videoRef.msRequestFullscreen) {
      this.videoContainerRef.msRequestFullscreen(); // IE/Edge
    }
  }
  exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  togglefullscreen() {
    if (document.fullscreenElement === null) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }
  getRefVideoContainer = (ref) => {
    console.log('ab')
    this.videoContainerRef = ref;
  };
  getRef = (ref) => {
    this.videoRef = ref;
  };
  render(){
    const {classes} = this.props;
    return (
      <div className={classes.webcamVideoContainer}>
        <div className={classes.worksBestInChromeContainer}>
          <div className={classes.chromeLogoContainer}>
            <ChromeLogo style={{width:60}}/>
          </div>
          <p className={classes.worksBestInChromeText}>Work best in Chrome</p>
        </div>
        <Presser
          onPress={this.enterFullscreen}
          className={classes.fullscreenButton}
        >
          <span>Make webcam fullscreen </span>
          <span></span>
        </Presser>
        <p>(then press "esc" key to exit fullscreen)</p>
        <div ref={this.getRefVideoContainer} className={classes.videoContainer}>
          <video
            ref={this.getRef}
            className={this.props.className}
          />
        </div>
      </div>
    );
  }
}
const WebcamVideo = injectSheet(styles)(WebcamVideo_notConnected);

class Step_notConnected extends PureComponent {
  render(){
    const {classes,imgSrc,text,number} = this.props;
    return (
      <div className={classes.stepContainer}>
        <h2 style={classes.stepH2}>Step {number}</h2>
        {!!imgSrc && (<img src={withPrefix(imgSrc)} />)}
        <p>{text}</p>
      </div>
    );
  }
}
const Step = injectSheet(styles)(Step_notConnected);

class WebcamPage extends PureComponent {
  constructor(){
    super();
    this.state = {};

  }

  async componentDidMount(){
    let previousDevice = localStorage.getItem('previousDevice') || null;
    if (previousDevice){
      previousDevice = JSON.parse(previousDevice);
    }
    this.setState({
      selectedDevice: previousDevice || null,
    });

    // =======

    let devices = await navigator.mediaDevices.enumerateDevices() || [];
    devices = devices.filter(({kind}) => kind ==='videoinput');
    this.setState({
      devices,
    });
    console.log('devices',devices);
    // .then(function (devices) {
    //   console.log('devices',devices);
    //   devices.forEach(function (device) {
    //     console.log(device.kind + ": LABEL = \"" + device.label + "\" ID = " + device.deviceId);
    //   });
    // });
    setTimeout(() => {
      this.setState({
        test: 'asdfqwer'
      })
    },2000)
  }
  onPressDeviceSelector = (value) => {
    console.log('value',value);
    localStorage.setItem('previousDevice',JSON.stringify(value));
    this.setState({
      selectedDevice: value,
    });
  };
  toggleWebcam = () => {
    console.log('asdfasdf')
    this.setState({
      webcamVisible: !this.state.webcamVisible,
    })
  };
  render(){
    const {classes = {}} = this.props;
    const {devices = emptyArray,webcamVisible} = this.state;
    console.log('webcamVisible',webcamVisible);
    return (
      <Layout>

        <SEO title="FORCE FOCUS YOUR CAMERA DURING A ZOOM CALL" />


        <h1 className={classes.h1}>How to force your camera to be the focus during a Zoom call, even if other people are talking.</h1>
        <Presser
          onPress={this.toggleWebcam}
          className={classes.toggleWebcamButton}
        >
          <span>{!!webcamVisible ? 'Hide webcam' : 'Show webcam'}</span>
          <span></span>
        </Presser>
        {
          !!webcamVisible && (
            <>
              {
                (typeof this.state.selectedDevice !== 'undefined') && (
                  <WebcamVideo
                    selectedDevice={this.state.selectedDevice}
                    className={classes.webcamVideo}
                  />
                )
              }
              {
                (devices.length > 1) && (
                  <div className={classes.deviceSelector}>
                    <p>Multiple webcams connected.  Which one do you want to use?</p>
                    {
                      devices.map((device) => {
                        const {label,deviceId} = device;
                        return (
                          <Presser
                            key={deviceId}
                            onPress={this.onPressDeviceSelector}
                            value={device}
                            className={classes.deviceSelectorPresser}
                          >
                            <span>{label}</span>
                            <span></span>
                          </Presser>
                        );
                      })
                    }
                  </div>
                )
              }
            </>
          )
        }

        <Step
          number={1}
          imgSrc={'/zoom1.png'}
          text={'In your Zoom meeting, press "Share Screen" (green button in the bottom center)'}
        />
        <Step
          number={2}
          imgSrc={'/zoom-screen-share-options.png'}
          text={'A selection screen will appear.  Select the box showing this very webpage.  It should be labeled something like "Google Chrome - FORCE FOCUS YOUR CAMERA DURING A ZOOM CALL"'}
        />
        <Step
          number={3}
          imgSrc={'/zoom-sharing-webpage.png'}
          text={'This very webpage should be the foreground of your computer now, with a green box around the window.  On this webpage, find the button that says "Show webcam" at the top. You will see your webcam video within this very webpage.  Now click "Make webcam fullscreen".  (You can press the "esc" key on your keyboard to exit fullscreen mode.)'}
        />
        <Step
          number={4}
          imgSrc={'/zoom-fullscreen-webpage.png'}
          text={'Now you are screen sharing this webpage which is showing a fullscreen live video of your webcam.  Everyone on your Zoom call can see only you, even if they start talking.'}
        />

      </Layout>
    );
  }
}

export default injectSheet(styles)(WebcamPage)
