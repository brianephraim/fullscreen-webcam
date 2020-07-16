import React, {PureComponent} from "react"
import { Link } from "gatsby"
import injectSheet from 'react-jss';

import Layout from "../components/layout"
import SEO from "../components/seo"

console.log('injectSheet',injectSheet);

const styles = {
  h1: {
    fontSize: 50,
    color: 'green',
  },
  deviceSelectorPresser: {
    borderRadius: 5,
    backgroundColor: '#eee',
    margin:5,
    cursor: 'pointer',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  deviceSelector: {
    display: 'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    marginBottom: 20,
  },
  webcamVideo: {
    width: '100%'
  },
};

class Presser extends PureComponent {
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
class WebcamVideo extends PureComponent {
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
    if (this.videoRef.requestFullscreen) {
      this.videoRef.requestFullscreen(); // W3C spec
    } else if (this.videoRef.mozRequestFullScreen) {
      this.videoRef.mozRequestFullScreen(); // Firefox
    } else if (this.videoRef.webkitRequestFullscreen) {
      this.videoRef.webkitRequestFullscreen(); // Safari
    } else if (this.videoRef.msRequestFullscreen) {
      this.videoRef.msRequestFullscreen(); // IE/Edge
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

  getRef = (ref) => {
    console.log('a')
    this.videoRef = ref;
  };
  render(){
    return (
      <video
        ref={this.getRef}
        className={this.props.className}
      />
    );
  }
}

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
  render(){
    const {classes = {}} = this.props;
    const {devices = emptyArray} = this.state;
    return (
      <Layout>
        <SEO title="Page two" />
        <h1 className={classes.h1}>Press ESCAPE on your keyboard to toggle fullscreen webcam video</h1>
        {
          (devices.length > 1) && (
            <>
              <p>Select your camera {this.state.test}</p>
              <div className={classes.deviceSelector}>
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
            </>
          )
        }
        {
          (typeof this.state.selectedDevice !== 'undefined') && (
            <WebcamVideo
              selectedDevice={this.state.selectedDevice}
              className={classes.webcamVideo}
            />
          )
        }
      </Layout>
    );
  }
}

export default injectSheet(styles)(WebcamPage)
