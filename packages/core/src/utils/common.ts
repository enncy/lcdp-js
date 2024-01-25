export function env<S>(handlers: { server: () => S; web: () => any }): S {
	if (typeof global === 'undefined') {
		return handlers.web();
	} else {
		return handlers.server();
	}
}
