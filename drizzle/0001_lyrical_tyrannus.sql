CREATE TABLE `hotmart_events` (
	`id` varchar(191) NOT NULL,
	`event` varchar(96) NOT NULL,
	`version` varchar(32) NOT NULL,
	`productUcode` varchar(191),
	`productName` text,
	`transactionId` varchar(191),
	`purchaseStatus` varchar(96),
	`amount` varchar(64),
	`currency` varchar(16),
	`occurredAt` timestamp,
	`payload` json NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	`processingError` text,
	CONSTRAINT `hotmart_events_id` PRIMARY KEY(`id`)
);
