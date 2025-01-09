import TicTacToe from "@/components/TicTacToe";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tic Tac Toe - Sanjog Rijal</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TicTacToe />
      </main>
    </>
  );
}
