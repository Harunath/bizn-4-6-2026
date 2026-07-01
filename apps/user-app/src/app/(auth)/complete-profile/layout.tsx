import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen w-screen bg-slate-100 text-black">
			<nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50">
				<div className="max-w-7xl h-full mx-auto flex justify-center items-center text-2xl font-black px-2 py-3">
					Fill the details
				</div>
			</nav>
			<div className="pt-16">{children}</div>
		</div>
	);
};

export default layout;
