class ApiResponse<T> {
	public status: boolean;
	constructor(
		public statusCode: number,
		public message: string,
		public data?: T,
	) {
		this.statusCode = statusCode;
		this.status = true;
		this.message = message;
		this.data = data;
	}
}

export default ApiResponse;
