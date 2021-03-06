/**
 * Created by synerzip on 09/02/16.
 */
var React = require('react-native');
var {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    LayoutAnimation,
    ActivityIndicatorIOS,
    StatusBarIOS,
    TextInput,
    Navigator,
    AlertIOS,
    Switch,
    TouchableOpacity
    } = React;

import config from '../common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActionCreator from '../common/actions/auth';
import {Actions} from 'react-native-router-flux'

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enablePassword: false
        };
    }

    onLogin() {
        this.props.authActions.loginUser(this.state.username,this.state.password);
    }

    onUserNameSubmit() {
        if (this.state.username && this.state.username.trim() != '') {
            this.setState({enablePassword: true});
            this.refs.password.focus();
        } else {
            this.setState({enablePassword: false});
        }
    }

    onPasswordSubmit() {
        //this.onLogin();
    }

    onCreateAccount(){
        Actions.createAccount();
    }

    onPINSubmit(pin){
        this.props.authActions.activateProfile(pin);
        this.props.authActions.resetInvalidPin();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.loginFail){
            AlertIOS.alert(nextProps.loginFailMessage);
            this.props.authActions.removeLoginFail();
        }else if(nextProps.accountActivationNeed){
            AlertIOS.prompt(
                'Enter PIN', null,
                [{text: 'Ok', onPress: this.onPINSubmit.bind(this)}]
            );
        }else if(nextProps.invalidPin){
            AlertIOS.prompt(
                'Invalid PIN, Enter Again', null,
                [{text: 'Ok', onPress: this.onPINSubmit.bind(this)}]
            );
        }
    }
    render() {

        var loginButton = <View style={[styles.loginButtonBox,{backgroundColor:'#CCCCCC'}]}>
            <View style={styles.loginButtonTouchBox}>
                <Text style={[styles.loginButtonLabel,{color:'#DDDDDD'}]}>Login</Text>
            </View>
        </View>;
        if (this.state.username && this.state.username.trim() != '' &&
            this.state.password && this.state.password.trim() != '') {
            loginButton = <View style={styles.loginButtonBox}>
                <TouchableOpacity style={styles.loginButtonTouchBox} onPress={this.onLogin.bind(this)}>
                    <Text style={styles.loginButtonLabel}>Login</Text>
                </TouchableOpacity>
            </View>;
        }
        return (
            <View style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.logoBox}>
                        <Image source={require('../common/images/logoNew.png')}/>
                    </View>
                    <View style={styles.loginBox}>
                        <View style={{flex:1}}>
                            <TextInput
                                style={{height: 40, marginTop:10,padding:5,
                                backgroundColor: '#FFFFFF',borderColor:'#CCCCCC',
                                borderWidth: 1,borderRadius:3}}
                                onChangeText={(username) => this.setState({username})}
                                placeholder="Username"
                                placeholderTextColor="#CCCCCC"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.username}
                                returnKeyType="next"
                                onEndEditing={this.onUserNameSubmit.bind(this)}
                                selectTextOnFocus
                                enablesReturnKeyAutomatically
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                />
                            <TextInput
                                ref='password'
                                style={{height: 40, marginTop:10,padding:5,
                                backgroundColor: '#FFFFFF',borderColor:'#CCCCCC',
                                borderWidth: 1,borderRadius:3}}
                                onChangeText={(password) => this.setState({password})}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="#CCCCCC"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.password}
                                editable={this.state.enablePassword}
                                returnKeyType="default"
                                onEndEditing={this.onPasswordSubmit.bind(this)}
                                selectTextOnFocus
                                enablesReturnKeyAutomatically
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                />
                        </View>
                        <View style={styles.rememberMeBox}>
                            <View style={{alignSelf:'flex-start',flex:1,paddingTop:5}}>
                                <Text style={styles.rememberMeLabel}>Remember Me</Text>
                            </View>
                            <View style={{alignSelf:'flex-end'}}>
                                <Switch
                                    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                                    style={{marginBottom: 2}}
                                    value={this.state.falseSwitchIsOn}/>
                            </View>
                        </View>
                        {loginButton}

                        <View style={[styles.bottomOptionBox,{marginTop:20}]}>
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordLabel}>Forgot Your Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.createNewAccountBox}>
                            <TouchableOpacity style={styles.createNewAccountTouchBox}
                                              onPress={this.onCreateAccount.bind(this)}>
                                <Text style={styles.createAccountLabel}>Create New Account</Text>
                            </TouchableOpacity>
                        </View>


                    </View>


                </ScrollView>
                <View style={styles.bottomBox}>
                    <View style={{alignSelf:'center'}}>
                        <Text style={styles.copyrightLabel}>Copyright @PDX</Text>
                    </View>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: config.backgroundColor
    },
    logoBox: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textLabel: {
        fontSize: 20,
        color: '#FFFFFF'
    },
    headerBox: {
        backgroundColor: '#00aebf',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        paddingTop: 5,
        height: 40
    },
    bottomBox: {
        height: 25,
        justifyContent: 'center',
    },
    bottomOptionBox: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    createAccountLabel: {
        color: '#FFFFFF'
    },
    loginButtonLabel: {
        color: '#FFFFFF'
    },
    forgotPasswordLabel: {
        color: '#2090CC'
    },
    loginButtonBox: {
        marginTop: 20,
        borderRadius:3,
        backgroundColor: 'rgb(38,196,70)',
        justifyContent: 'center',
    },
    loginButtonTouchBox: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1
    },
    createNewAccountBox: {
        marginTop: 20,
        borderRadius:3,
        backgroundColor: config.segmentedTintColor,
        justifyContent: 'center',
    },
    createNewAccountTouchBox: {
        flexDirection: 'row',
        padding:15,
        justifyContent: 'center',
        flex: 1
    },
    loginBox: {
        flex: 1,
        margin: 40,
        marginTop:25
    },
    rememberMeBox: {
        marginTop: 10,
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 1,
        borderColor: '#CCCCCC'
    },
    rememberMeLabel: {
        color: '#ABADAE'
    },
    copyrightLabel: {
        color: '#CCCCCC'
    }
});

const mapStateToProps = (state) => ({
    "loginFail":state.auth.loginFail,
    "accountActivationNeed":state.auth.accountActivationNeed,
    "invalidPin":state.auth.invalidPin,
    "loginFailMessage":state.auth.loginFailMessage
});

const mapDispatchToProps = (dispatch) => ({
    'authActions': bindActionCreators(authActionCreator, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);