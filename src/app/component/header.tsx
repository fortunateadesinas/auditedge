import { WavyBackground } from "./ui/background"

export default function Header() {

    return (
        <WavyBackground className="max-w-4xl mx-auto pb-20">
            <p className="text-4xl md:text-4xl lg:text-7xl text-white font-bold text-center">
                <span className="text-green-700">AuditEdge</span>, Intelligent Smart Contract Auditor
            </p>
            <p className="text-base md:text-2xl mt-4 text-white font-normal text-center">
                Harness AI's capabilities to thoroughly analyze and audit your smart contracts.
            </p>
        </WavyBackground>
    )
}
