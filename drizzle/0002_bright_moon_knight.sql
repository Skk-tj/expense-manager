CREATE TABLE `queued_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_date` text NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'CAD' NOT NULL,
	`vendor` text,
	`category_id` integer,
	`is_my_card` integer DEFAULT true NOT NULL,
	`extra_info` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
