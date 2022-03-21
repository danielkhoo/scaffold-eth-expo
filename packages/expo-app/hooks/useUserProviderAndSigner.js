import { useMemo, useState } from 'react';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { useBurnerSigner } from 'eth-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 *  Gets user provider/signer from injected provider or local provider
 *  Use your injected provider from 🦊 Metamask
 *  If you don't have it then instantly generate a 🔥 burner wallet from a local provider
 *
  ~ Features ~
  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
 * @param injectedProviderOrSigner (TEthersProviderOrSigner) :: injected provider/signer from metamask etc..
 * @param localProvider (TEthersProvider) local provider to generate a burner wallet from
 * @param useBurnerWallet (boolean) lets the hook know wether to use the burner wallet or not
 * @returns (TProviderAndSigner)
 */
export const useUserProviderAndSigner = (injectedProviderOrSigner, localProvider, useBurnerWallet) => {
    const [signer, setSigner] = useState();
    const [provider, setProvider] = useState();
    const [providerNetwork, setProviderNetwork] = useState();
    const burnerSigner = useBurnerSigner(localProvider);
    useMemo(() => {
        if (injectedProviderOrSigner) {
            console.log('🦊 Using injected provider');
            void parseProviderOrSigner(injectedProviderOrSigner).then((result) => {
                if (result != null)
                    setSigner(result.signer);
            });
        }
        else if (!localProvider) {
            setSigner(undefined);
        }
        else if (useBurnerWallet) {
            console.log('🔥 Using burner signer');
            setSigner(burnerSigner);
        }
        else {
            console.log("burner is off");
        }
    }, [injectedProviderOrSigner, localProvider, burnerSigner]);
    useMemo(() => {
        if (signer) {
            const result = parseProviderOrSigner(signer);
            void result.then((r) => {
                setProvider(r.provider);
                setProviderNetwork(r.providerNetwork);
            });
        }
    }, [signer]);
    return { signer, provider, providerNetwork };
};


const parseProviderOrSigner = async (providerOrSigner) => {
    let signer = undefined;
    let provider;
    let providerNetwork;
    if (providerOrSigner && (providerOrSigner instanceof JsonRpcProvider || providerOrSigner instanceof Web3Provider)) {
        const accounts = await providerOrSigner.listAccounts();
        if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
        }
        provider = providerOrSigner;
        providerNetwork = await providerOrSigner.getNetwork();
    }
    if (!signer && providerOrSigner instanceof Signer) {
        signer = providerOrSigner;
        provider = signer.provider;
        providerNetwork = provider && (await provider.getNetwork());
    }
    return { signer, provider, providerNetwork };
};