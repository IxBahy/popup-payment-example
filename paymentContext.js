import { createContext, useState, useRef, useEffect } from "react";
import useInput from "../hooks/useInput";
import { addBalance, getPaymentOrder, linkPaypalAccount, paymentCapture, withdrawBalance } from "../pages/api/payment";
import { getMyOverview } from "../pages/api/profile";
import useAppContext from "./authContexts";
import { getloggedinUser } from "../pages/api/auth";

const PaymentContext = createContext({
    isPaying: false,
    popupIsClosed: false,
    successMessage: false,
    showPaymentModal: false,
    showWithdrawModal: false,
    showEmailModal: false,
    emailIsLinked: false,
    paymentAmountState: 0,
    paymentAmountIsInvalid: false,
    withdrawAmountState: 0,
    withdrawAmountIsInvalid: false,
    emailState: '',
    emailIsInvalid: false,
    isEditingEmail: false,
    popup: {},
    popupRef: {},
    handlePaymentPopupClose: () => { },
    handlePayment: () => { },
    handleWithdraw: () => { },
    handleLinkPaypalAccount: () => { },
    togglePayemntModal: () => { },
    toggleEmailModal: () => { },
    toggleWithdrawModal: () => { },
    linkAccountModalSubmitHandler: () => { },
    withdrawModalSubmitHandler: () => { },
    paymentModalSubmitHandler: () => { },
    paymentAmountChangeHandler: () => { },
    withdrawAmountChangeHandler: () => { },
    emailChangeHandler: () => { },
    setEmailIsLinked: () => { },
    toggleEditEmailModal: () => { },
    showSuccessfulPayment: () => { },
})

export function PaymentContextProvider(props) {
    //FOT RECHARGE
    // const [isPaying, setIsPaying] = useState(false);
    // const [popupIsClosed, setPopupIsClosed] = useState(false);
    // const [isCapturing, setIsCapturing] = useState(false);
    // const [paymentId, setPaymentId] = useState('');
    // const [payerId, setPayerId] = useState('');
    // const popupRef = useRef(null);
    // let popup;



    //NEW CODE
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    //FOR TELR
    const [showTelrModal, setShowTelrModal] = useState(false);
    //FOR WITHDRAW
    const [balance, setBalance] = useState(0);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    //FOR LINKING EMAIL
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailIsLinked, setEmailIsLinked] = useState(false)
    //this is used to control the ui of the email modal
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    //GENERAL
    const [UserData, setUserData] = useState();
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        getMyOverview().then((res) => {
            setBalance(res.data.data?.balance?.available)
            console.log(res.data.data?.balance?.available)
        })

        //eslint-disable-next-line 
    }, [])


    //validation for form inputs

    // input validation functions
    const checkNotEmpty = (inputText) => {
        return (inputText.trim().length > 0 && inputText > 0)
    }
    const checkNotEmptyAndAvailable = (inputText) => {
        return (inputText.trim().length > 0 && inputText >= 5 && inputText <= balance)
    }
    const checkEmail = (email) => {
        return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) && email !== UserData?.paypal_email
    }


    //modals inputs
    const { inputState: paymentAmountState,
        inputIsInvalid: paymentAmountIsInvalid,
        inputChangeHandler: paymentAmountChangeHandler,
        inputResetHandler: paymentAmountResetHandler
    } = useInput(checkNotEmpty)
    const { inputState: withdrawAmountState,
        inputIsInvalid: withdrawAmountIsInvalid,
        inputChangeHandler: withdrawAmountChangeHandler,
        inputResetHandler: withdrawAmountResetHandler
    } = useInput(checkNotEmptyAndAvailable)
    const { inputState: emailState,
        inputIsInvalid: emailIsInvalid,
        inputChangeHandler: emailChangeHandler,
        inputResetHandler: emailResetHandler,
        setInputValueHandler: setEmailValue
    } = useInput(checkEmail)

    //popup functions



    //modal togglers
    const togglePayemntModal = () => {
        paymentAmountResetHandler()
        setShowPaymentModal(prevState => !prevState)
    }
    const toggleTelrModal = () => {
        paymentAmountResetHandler()
        setShowTelrModal(prevState => !prevState)
    }
    const toggleWithdrawModal = () => {
        withdrawAmountResetHandler()
        setShowWithdrawModal(prevState => !prevState)
    }
    const toggleEmailModal = () => {
        emailResetHandler()
        setShowEmailModal(prevState => !prevState)
    }
    const toggleEditEmailModal = () => {
        emailResetHandler()
        setIsEditingEmail(prevState => !prevState)
        setEmailValue(UserData?.paypal_email)
        setShowEmailModal(prevState => !prevState)
    }
    //submit handler
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////    ADD BALANCE   //////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    // useEffect(() => {
    //     console.log(popupIsClosed);
    //     let paymentInterval;
    //     if (isPaying) {
    //         paymentInterval = setInterval(handlePaymentPopupClose, 200);
    //     }

    //     return () => {
    //         if (paymentInterval) {
    //             clearInterval(paymentInterval)

    //         }
    //     }
    //     //eslint-disable-next-line
    // }, [isPaying]);
    // const paymentModalSubmitHandler = () => {
    //     handlePayment()
    // }
    // const handlePayment = async () => {
    //     if (!paymentAmountIsInvalid) {
    //         const res = await addBalance(paymentAmountState.value)
    //         const paymentData = await res.data.data
    //         setPaymentId(paymentData.id)
    //         const paymentLink = paymentData.links.filter(link => link.rel === 'approve')[0]
    //         popup = createPopup(paymentLink)
    //         popup.focus();
    //         console.log('here is popup', popup);
    //         popupRef.current = popup;
    //         setIsPaying(true)
    //     }
    // }
    // const createPopup = (paymentLink) => {
    //     const left = window.innerWidth / 2 - 900 / 2;
    //     const top = window.innerHeight / 2 - 900 / 2;
    //     const popup = window.open(paymentLink.href, "Popup", "width=900,height=900,left=" + left + ",top=" + top);
    //     return popup
    // }
    // function handlePaymentPopupClose() {
    //     checkPaymentCompleted()
    //     setPopupIsClosed(popupRef.current.closed)
    //     if (popupRef.current.closed) {
    //         setIsPaying(false)
    //     }
    // }
    // const checkPaymentCompleted = async () => {
    //     if (!isCapturing) {
    //         if (paymentId !== '') {
    //             const res = await getPaymentOrder(paymentId)
    //             const paymentData = await res.data.data
    //             console.log(paymentData.status);
    //             if (paymentData.status === 'APPROVED') {
    //                 const id = paymentData.payer.payer_id
    //                 setPayerId(id)
    //                 capturePaymentWithoutSDK(id)
    //             }
    //         }
    //     }

    // }
    // const capturePaymentWithoutSDK = (id) => {
    //     if (paymentId !== '') {
    //         setIsCapturing(true)
    //         console.log(paymentId);
    //         paymentCapture(paymentId, { "payer_id": id }).then(res => {
    //             if (res.status === 200) {
    //                 popupRef.current.close()
    //                 togglePayemntModal()
    //                 openSuccessMessage()
    //                 setIsCapturing(false)
    //                 console.log('captured succsess');
    //             }
    //         })
    //     }
    // }
    // ////////////////////////////NEW CODE FOR THE SDK////////////////////////
    const showSuccessfulPayment = () => {
        togglePayemntModal()
        openSuccessMessage()
        console.log('captured succsess2');
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////    WITHDRAW   /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    const withdrawModalSubmitHandler = async () => {
        const responseStatus = await handleWithdraw()
        if (responseStatus === 200) {
            openSuccessMessage()
            toggleWithdrawModal()
        }
    }
    const handleWithdraw = async () => {
        if (!withdrawAmountIsInvalid) {
            const res = await withdrawBalance({ "amount": withdrawAmountState.value })
            const status = await res.status
            return status
        }
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////////    LINK EMAIL   ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    //for email change
    useEffect(() => {
        getloggedinUser().then((res) => {
            if (res.status === 200) {
                const data = res.data.data.user
                setUserData(data)
            }
        }
        )
        //eslint-disable-next-line 
    }, [emailIsLinked])


    const linkAccountModalSubmitHandler = async () => {
        // console.log(emailState.value);
        const responseStatus = await handleLinkPaypalAccount()
        if (responseStatus === 200) {
            // this flag is used to invoke thew useeffect in every email change so the value appering in the modal stays accurate
            setEmailIsLinked(prevState => !prevState)
            openSuccessMessage()
            if (isEditingEmail) {
                setIsEditingEmail(true)
            }
            toggleEmailModal()
        }
    }

    const handleLinkPaypalAccount = async () => {
        if (!emailIsInvalid) {
            const res = await linkPaypalAccount({ "paypal_email": emailState.value })
            const status = await res.status
            return status
        }
    }

    const openSuccessMessage = () => {
        setSuccessMessage(true)
        setTimeout(function () {
            setSuccessMessage(false);
        }, 3000)
    }

    const providerValue = {
        // isPaying,
        // popupIsClosed,
        // popup,
        // popupRef,
        successMessage,
        paymentAmountState,
        paymentAmountIsInvalid,
        withdrawAmountState,
        withdrawAmountIsInvalid,
        emailState,
        emailIsInvalid,
        emailIsLinked,
        showPaymentModal,
        showTelrModal,
        showEmailModal,
        showWithdrawModal,
        isEditingEmail,
        // handlePaymentPopupClose,
        // handlePayment,
        // paymentModalSubmitHandler,
        handleWithdraw,
        handleLinkPaypalAccount,
        togglePayemntModal,
        toggleEmailModal,
        toggleWithdrawModal,
        toggleTelrModal,
        linkAccountModalSubmitHandler,
        withdrawModalSubmitHandler,
        paymentAmountChangeHandler,
        withdrawAmountChangeHandler,
        emailChangeHandler,
        setEmailIsLinked,
        toggleEditEmailModal,
        showSuccessfulPayment

    }

    return (
        <PaymentContext.Provider value={providerValue}>
            {props.children}
        </PaymentContext.Provider>
    )
}
export default PaymentContext