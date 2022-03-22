import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
// Polyfill for localStorage
import "./helpers/windows";
import { useOnBlock } from "eth-hooks/useOnBlock";
import { useBalance } from "eth-hooks/useBalance";
import { useGasPrice } from "eth-hooks/useGasPrice";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useContractReader } from "eth-hooks/useContractReader";
import { useContractLoader } from "eth-hooks/useContractLoader";
// import { useUserProviderAndSigner } from "eth-hooks/useUserProviderAndSigner";
import externalContracts from "./contracts/external_contracts";
import deployedContracts from "./contracts/hardhat_contracts.json";
// import { Transactor, Web3ModalSetup } from "./helpers";
import { useStaticJsonRPC, useUserProviderAndSigner } from "./hooks";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ethers } from "ethers";
import AddressDisplay from "./components/AddressDisplay";
import RNPickerSelect from "react-native-picker-select";
import TokenDisplay from "./components/TokenDisplay";

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

const DEBUG = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

export default function App() {
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([targetNetwork.rpcUrl]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");


  // Use your injected provider from 🦊 Metamask
  const userProvider =
    useUserProviderAndSigner(
      injectedProvider,
      localProvider,
      USE_BURNER_WALLET
    ) || {};


  // On App load, check async storage for an existing wallet, else generate a 🔥 burner wallet.
  const [userSigner, setUserSigner] = useState();
  useEffect(() => {
    const loadAccountAndNetwork = async () => {
      // FIXME: REFACTOR TO USE SECURE STORAGE
      const pk = await AsyncStorage.getItem('metaPrivateKey')
      if (!pk) {
        const generatedWallet = ethers.Wallet.createRandom();
        const privateKey = generatedWallet._signingKey().privateKey;
        await AsyncStorage.setItem('metaPrivateKey', privateKey)
        setUserSigner(generatedWallet);
      } else {
        const existingWallet = new ethers.Wallet(pk);
        setUserSigner(existingWallet);
      }

      const cachedNetwork = await AsyncStorage.getItem('network')
      if (cachedNetwork) setSelectedNetwork(cachedNetwork)
    }
    loadAccountAndNetwork()
  }, [])

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  const options = [];
  for (const id in NETWORKS) {
    options.push(
      { label: NETWORKS[id].name, value: NETWORKS[id].name, color: NETWORKS[id].color }
    );
  }




  // You can warn the user if you would like them to be on a specific network
  const localChainId =
    localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner &&
    userSigner.provider &&
    userSigner.provider._network &&
    userSigner.provider._network.chainId;

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = {
    deployedContracts: deployedContracts || {},
    externalContracts: externalContracts || {},
  };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  useEffect(() => {
    if (DEBUG && mainnetProvider && address && selectedNetwork && yourLocalBalance && yourMainnetBalance) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________")
      console.log("🌎 mainnetProvider", mainnetProvider)
      console.log("🏠 localChainId", localChainId)
      console.log("👩‍💼 selected address:", address)
      console.log("🕵🏻‍♂️ selectedNetwork:", selectedNetwork)
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...")
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...")
    }
  }, [mainnetProvider, address, selectedNetwork, yourLocalBalance, yourMainnetBalance, readContracts])



  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RNPickerSelect
        value={selectedNetwork}
        onValueChange={async (value) => {
          await AsyncStorage.setItem('network', value)
          setSelectedNetwork(value)
        }}
        items={options}
        style={pickerSelectStyles}

      />
      {address &&
        <View style={{ marginTop: 60 }}>
          <AddressDisplay address={address} />
          <TokenDisplay tokenBalance={yourLocalBalance} tokenName={'Ether'} tokenSymbol={'ETH'} tokenPrice={price} />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginHorizontal: '20%',
    width: '60%',
    height: 36,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 32,
    color: 'black',
    // backgroundColor: '#eee'
  },
  iconContainer: {
    top: 46,
    right: 100,
  },
  chevronDown: {
    color: '#fff'
  }
});