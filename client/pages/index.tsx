import type { NextPage } from "next";
import Head from "next/head";
import { Flex, Text, Heading, Button, Input } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "../context/ConnectionContext";
import { Wave } from "../types/wave";
import trunacteEthAddress from "truncate-eth-address";

const Home: NextPage = () => {
	const { accounts, contract, connectWallet } = useContext(ConnectionContext);
	const [totalWaves, setTotalWaves] = useState<number>(0);
	const [allWaves, setAllWaves] = useState<Wave[]>([]);
	const [value, setValue] = useState<string>("");

	const handleChange = (event: any) => setValue(event.target.value);

	const wave = async () => {
		await contract?.wave(value, { gasLimit: 300000 });
	};

	const getAllWaves = async () => {
		const waves: Wave[] = await contract?.getAllWaves();
		waves?.map((wave) => {
			return {
				address: wave.waver,
				timestamp: wave.timestamp,
				message: wave.message,
			};
		});
		console.log(waves);
		setAllWaves(waves);
	};

	const onNewWave = (wave: Wave) => {
		console.log("NewWave", wave);
		setAllWaves({
			...allWaves,
			[wave.waver]: wave.waver,
			[wave.timestamp]: wave.timestamp,
			[wave.message]: wave.message,
		});
		setTotalWaves(allWaves.length);
	};

	useEffect(() => {
		getAllWaves();
		contract?.on("NewWave", onNewWave);

		return () => {
			if (contract) {
				contract.off("NewWave", onNewWave);
			}
		};
	}, []);

	return (
		<Flex>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Flex
				color="white"
				flexDir="column"
				bgColor="black"
				height="100vh"
				alignItems="center"
				w="100vw"
			>
				<Flex h="30vh" alignItems="center">
					<Heading w="100%" fontSize="48px" textAlign="center">
						~HELLO~
					</Heading>
				</Flex>
				<Flex flexDir="column" textAlign="center">
					<Text fontSize="36px">
						My name is Jo Rocca and I am a blockchain dev!
					</Text>
					<Input
						placeholder="Say hello on chain!"
						value={value}
						onChange={handleChange}
						maxLength={20}
					/>
					<Button
						bgColor="purple"
						color="white"
						padding="30px"
						border="none"
						borderRadius="30px"
						alignSelf="center"
						fontSize="24px"
						my="15px"
						onClick={accounts ? wave : connectWallet}
					>
						{accounts ? "Wave and send a message!" : "Connect Metamask"}
					</Button>

					{accounts ? (
						<>
							<Flex
								justify="space-around"
								mt="50px"
								w="500px"
								alignSelf="center"
								align="center"
							>
								<Text fontSize="24px">Total waves: {totalWaves}</Text>
							</Flex>
							{totalWaves > 0 && (
								<Flex my="50px" border="3px white solid" flexDir="column">
									{allWaves.map((wave, index) => {
										return (
											<Flex
												key={index}
												justify="space-between"
												w="100%"
												padding="20px"
												borderBottom={
													index === totalWaves - 1 ? "none" : "3px solid white"
												}
											>
												<Text>Address: {trunacteEthAddress(wave.waver)}</Text>
												<Flex w="1px" bgColor="white" height="100%"></Flex>
												<Text>
													Time:{" "}
													{new Date(
														Number(wave.timestamp) * 1000
													).toLocaleString()}
												</Text>
												<Flex w="1px" bgColor="white" height="100%"></Flex>
												<Text>Message: {wave.message}</Text>
											</Flex>
										);
									})}
								</Flex>
							)}
						</>
					) : null}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Home;
