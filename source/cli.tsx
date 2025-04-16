#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './App.js';

// const cli = meow(
// 	`
// 	Usage
// 	  $ dashit-navi

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ dashit-navi --name=Jane
// 	  Hello, Jane
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );

render(<App />);
